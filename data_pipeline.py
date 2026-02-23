import os
import glob
import argparse
import pandas as pd
from PIL import Image

# GalarCapsuleML expected classes
SECTIONS = ["outside", "mouth", "esophagus", "stomach", "small intestine", "colon"]
ABNORMALITIES = ["polyp", "ulcer", "blood", "erosion", "clear"]
TECHNICAL = ["bubbles", "dirt", "good view", "reduced view", "no view"]

def IngestVRCaps(unity_export_dir, output_meta_csv, default_section="small intestine", dataset_name="vrcaps"):
    """
    Ingests synthetic sequences from VR-Caps and formats to GalarCapsuleML specification.
    Format expects one-hot encoding for the classes + a path column at the end.
    Example: outside,mouth,esophagus,stomach,small intestine,colon,path
    """
    frames = sorted(glob.glob(os.path.join(unity_export_dir, "RGB", "*.png")))
    if not frames:
        frames = sorted(glob.glob(os.path.join(unity_export_dir, "*.png")))
        
    data = []
    
    for frame_path in frames:
        # We need relative paths for GalarCapsuleML datasets usually
        rel_path = f"{dataset_name}/{os.path.basename(frame_path)}"
        
        row = {}
        # 1. Section (Multiclass)
        for s in SECTIONS:
            row[s] = 1 if s == default_section else 0
            
        # 2. Path (Must be the last column as per Galar schema usually, or we can just emit one large CSV)
        # Note: Galar docs show 'path' at the end of the section problem: 
        # "outside,mouth,esophagus,stomach,small intestine,colon,path"
        row["path"] = rel_path
        
        # Optionally add abnormalities if needed (multi-label)
        # We assume clean synthetic data by default unless specified
        for a in ABNORMALITIES:
            row[a] = 1 if a == "clear" else 0
            
        # Optional depth map linking for our own records
        depth_path = frame_path.replace("RGB", "Depth").replace(".png", "_depth.png")
        if os.path.exists(depth_path):
            row["depth_map"] = depth_path
            
        data.append(row)
        
    df = pd.DataFrame(data)
    
    # Reorder columns to ensure 'path' is placed where Galar code expects it for the 'section' problem
    # For a general dataset file, we can keep them all.
    cols = SECTIONS + ["path"] + ABNORMALITIES + ([c for c in df.columns if c == "depth_map"])
    df = df[cols]
    
    os.makedirs(os.path.dirname(os.path.abspath(output_meta_csv)), exist_ok=True)
    df.to_csv(output_meta_csv, index=False)
    print(f"Synthetic data ingested: {len(df)} frames.")
    print(f"Formatted metadata saved to: {output_meta_csv}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest VR-Caps synthetic data for ML pipeline")
    parser.add_argument("--input_dir", type=str, required=True, help="Directory containing RGB frames from Unity")
    parser.add_argument("--output_csv", type=str, default="./synthetic_dataset.csv", help="Output CSV path")
    parser.add_argument("--section", type=str, default="small intestine", choices=SECTIONS, help="Default anatomical section")
    parser.add_argument("--dataset_name", type=str, default="vrcaps_run1", help="Dataset name space for relative paths")
    
    args = parser.parse_args()
    IngestVRCaps(args.input_dir, args.output_csv, args.section, args.dataset_name)
