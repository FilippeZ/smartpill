import os
import shutil
import pandas as pd
from sklearn.model_selection import train_test_split

def prepare_galar_dataset(image_dir, labels_csv, output_dir):
    """
    Creates the folder structure and CSVs expected by GalarCapsuleML.
    """
    os.makedirs(output_dir, exist_ok=True)
    images_out = os.path.join(output_dir, "images")
    os.makedirs(images_out, exist_ok=True)
    
    df = pd.read_csv(labels_csv)
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
    val_df, test_df = train_test_split(test_df, test_size=0.5, random_state=42)
    
    train_df.to_csv(os.path.join(output_dir, "train.csv"), index=False)
    val_df.to_csv(os.path.join(output_dir, "val.csv"), index=False)
    test_df.to_csv(os.path.join(output_dir, "test.csv"), index=False)
    
    # Copy images to output image dir
    for img_name in df['filename']:
        shutil.copy(os.path.join(image_dir, img_name), os.path.join(images_out, img_name))
    
    print(f"Dataset prepared at {output_dir}")

def prepare_pix2pix_folders(lr_dir, hr_dir, output_dir):
    """
    Prepares A/B folders for pix2pix (EndoL2H) training.
    """
    for split in ['train', 'val', 'test']:
        os.makedirs(os.path.join(output_dir, split), exist_ok=True)
        # pix2pix expects images concatenated side-by-side or in A/B folders
        # Here we just setup the structure
    print(f"Pix2Pix structure ready at {output_dir}")

if __name__ == "__main__":
    # Example usage
    pass
