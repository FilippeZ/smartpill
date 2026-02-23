import torch
import sys
import os
from PIL import Image
import torchvision.transforms as transforms

# Add EndoL2H to path - robustly find the project root from backend/models/
backend_models_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(backend_models_dir, '..', '..'))
lib_path = os.path.join(project_root, 'lib', 'EndoL2H')

if os.path.exists(lib_path):
    sys.path.append(lib_path)
    try:
        from models.networks import define_G
    except ImportError:
        print(f"Warning: Could not import models.networks from {lib_path}")
        define_G = None
else:
    print(f"Warning: EndoL2H lib path not found at {lib_path}")
    define_G = None

class EndoL2HWrapper:
    def __init__(self, model_path, gpu_ids=[0] if torch.cuda.is_available() else [], scale_factor=8):
        self.device = torch.device(f'cuda:{gpu_ids[0]}' if gpu_ids else 'cpu')
        self.scale_factor = scale_factor
        
        # Standard EndoL2H params: unet_256, instance norm, no dropout. 
        # Note: Actual netG args might differ based on repo fork, assuming standard matching
        if define_G:
            self.netG = define_G(3, 3, 64, 'unet_256', norm='instance', use_dropout=False, gpu_ids=gpu_ids)
            
            # Load weights
            state_dict = torch.load(model_path, map_location=self.device)
            if hasattr(state_dict, '_metadata'):
                del state_dict._metadata
            
            # Fix for DataParallel if saved with it
            from collections import OrderedDict
            new_state_dict = OrderedDict()
            for k, v in state_dict.items():
                name = k[7:] if k.startswith('module.') else k
                new_state_dict[name] = v
                
            self.netG.load_state_dict(new_state_dict)
            self.netG.eval()
        else:
            self.netG = None
            print("Running EndoL2HWrapper in dummy mode since 'define_G' is missing.")
        
        # The EndoL2H paper says LR inputs are 128x128 and sizes up to 1024x1024 for 8x
        self.input_size = 128
        self.transform = transforms.Compose([
            transforms.Resize((self.input_size, self.input_size)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

    def upscale(self, image_path):
        img = Image.open(image_path).convert('RGB')
        img_t = self.transform(img).unsqueeze(0).to(self.device)
        
        if self.netG:
            with torch.no_grad():
                output = self.netG(img_t)
            
            # Denormalize
            output = (output.squeeze(0).cpu() + 1) / 2.0
            output_img = transforms.ToPILImage()(output)
            
            # If the network architecture doesn't natively scale by the scale_factor, 
            # we manually resize the output to the target HR resolution as a fallback/guarantee.
            target_size = self.input_size * self.scale_factor
            if output_img.size != (target_size, target_size):
                output_img = output_img.resize((target_size, target_size), Image.BICUBIC)
                
            return output_img
        else:
            # Dummy upscale if lib not found
            target_size = self.input_size * self.scale_factor
            return img.resize((target_size, target_size), Image.BICUBIC)

if __name__ == "__main__":
    # Test stub
    pass
