import os
import argparse
import json
from backend.models.endo_l2h_wrapper import EndoL2HWrapper
from backend.models.galar_ml_wrapper import GalarMLWrapper
from PIL import Image

def run_pipeline(image_path, endo_weights, galar_weights, output_dir, galar_model_arch='resnet50', upscaling_factor=8):
    os.makedirs(output_dir, exist_ok=True)
    
    print("--- Initializing End-to-End SmartPill Pipeline ---")
    
    # 1. Initialize Wrappers
    print(f"Loading EndoL2H (Upsampling factor: {upscaling_factor}x)...")
    endo_model = EndoL2HWrapper(endo_weights, scale_factor=upscaling_factor)
    
    print(f"Loading GalarCapsuleML ({galar_model_arch})...")
    galar_model = GalarMLWrapper(galar_model_arch, galar_weights)
    
    print(f"--- Processing Image: {image_path} ---")
    
    # 2. Image Enhancement
    hr_img = endo_model.upscale(image_path)
    hr_path = os.path.join(output_dir, "enhanced_hr.png")
    hr_img.save(hr_path)
    print(f"Enhanced High-Resolution image saved to {hr_path}")
    
    # 3. Disease Classification & Localization
    predictions = galar_model.predict(hr_img)
    
    # 4. Generate Clinical Report
    # Check for abnormalities thresholding > 0.5 probability
    abnormalities = {k: v for k, v in predictions.items() if k in ['polyp', 'ulcer', 'blood', 'erosion'] and v > 0.5}
    
    report = {
        "metadata": {
            "pipeline_version": "2.4.0",
            "input_file": image_path,
            "enhanced_file": hr_path,
            "super_resolution_model": "EndoL2H",
            "classification_model": f"GalarCapsuleML_{galar_model_arch}"
        },
        "predictions": predictions,
        "clinical_summary": {
            "status": "ALERT - Abnormalities Detected" if abnormalities else "CLEAN - No Significant Findings",
            "findings": abnormalities
        }
    }
    
    report_path = os.path.join(output_dir, "clinical_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=4)
    
    print(f"Clinical report generated at {report_path}")
    return report

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Capsule Endoscopy End-to-End Pipeline")
    parser.add_argument("--input", required=True, help="Path to raw image frame")
    parser.add_argument("--endo_weights", required=True, help="Path to EndoL2H weights")
    parser.add_argument("--galar_weights", required=True, help="Path to GalarML weights")
    parser.add_argument("--galar_arch", default="resnet50", help="Architecture for GalarML (resnet18, resnet50, vit_b_16...)")
    parser.add_argument("--upscale", type=int, default=8, help="Upscaling factor for EndoL2H")
    parser.add_argument("--output", default="./output", help="Output directory")
    
    args = parser.parse_args()
    
    try:
        run_pipeline(args.input, args.endo_weights, args.galar_weights, args.output, args.galar_arch, args.upscale)
    except Exception as e:
        print(f"Pipeline Execution Failed: {str(e)}")

