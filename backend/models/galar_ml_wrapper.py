import torch
import sys
import os
import pandas as pd
from PIL import Image
import albumentations as A
from albumentations.pytorch import ToTensorV2
import numpy as np

# Add GalarCapsuleML to path - robustly find the project root from backend/models/
backend_models_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(backend_models_dir, '..', '..'))
lib_path = os.path.join(project_root, 'lib', 'GalarCapsuleML')

if os.path.exists(lib_path):
    sys.path.append(lib_path)
    try:
        from model import prepare_model
        from utils import ClassificationType
    except ImportError:
        print(f"Warning: Could not import Galar model/utils from {lib_path}")
        prepare_model = None
        ClassificationType = None
else:
    print(f"Warning: GalarCapsuleML lib path not found at {lib_path}")
    prepare_model = None
    ClassificationType = None

class SimpleArgs:
    def __init__(self, model_type):
        valid_models = [
            'resnet18', 'resnet34', 'resnet50', 'resnet101', 'resnet152',
            'vit_l_32', 'vit_b_16', 'efficientnet_v2_m', 'efficientnet_v2_s'
        ]
        if model_type not in valid_models:
            print(f"Warning: model_type {model_type} not in Galar default list. Defaulting to resnet18")
            self.model = 'resnet18'
        else:
            self.model = model_type
            
        self.dual_output = False
        self.pretrained = True
        self.dropout = 0.2
        self.freeze = 0
        self.optimizer = 'adam'
        self.learning_rate = 1e-4
        self.weight_decay = 1e-5

class GalarMLWrapper:
    def __init__(self, model_type='resnet18', weights_path=None):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        args = SimpleArgs(model_type)
        
        # We assume MULTILABEL for general disease detection mapping all 11 classes simultaneously
        if prepare_model:
            self.model, _, _ = prepare_model(
                args, 
                print, 
                features=['landmark', 'abnormality'], 
                classification_type=ClassificationType.MULTILABEL, 
                device=self.device
            )
            
            if weights_path and os.path.exists(weights_path):
                self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
            self.model.eval()
        else:
            self.model = None
            print("GalarMLWrapper running in dummy mode.")
        
        # Determine image resolution based on architecture
        if 'vit' in args.model:
            img_res = 224 # ViT common resolution
        elif 'efficientnet' in args.model:
            img_res = 384 if 'm' in args.model else 300 # EffNet scaling, simplifying for wrapper 
        else:
            img_res = 224 # ResNet standard
        
        self.transform = A.Compose([
            A.Resize(img_res, img_res),
            A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
            ToTensorV2(),
        ])
        
        self.classes = [
            'esophagus', 'stomach', 'small_bowel', 'colon', # landmarks
            'polyp', 'ulcer', 'blood', 'erosion',           # abnormalities
            'bubbles', 'dirt', 'clear'                      # technical
        ]

    def predict(self, image):
        if isinstance(image, str):
            image = Image.open(image).convert('RGB')
        
        image_np = np.array(image)
        augmented = self.transform(image=image_np)
        img_t = augmented['image'].unsqueeze(0).to(self.device)
        
        if self.model:
            with torch.no_grad():
                outputs = self.model(img_t)
                probs = torch.sigmoid(outputs).cpu().numpy()[0]
        else:
            # Dummy predictions if model not loaded
            np.random.seed(42) # Deterministic dummy
            probs = np.random.rand(len(self.classes)) * 0.1
            if np.random.rand() > 0.5:
                probs[4] = 0.95 # fake polyp
        
        results = {self.classes[i]: float(probs[i]) for i in range(len(self.classes))}
        return results
