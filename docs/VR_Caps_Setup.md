# Virtual Capsule Endoscopy (VR-Caps) Setup Guide

This document outlines the procedure to generate high-fidelity synthetic capsule endoscopy data using the VR-Caps Unity environment, and how to ingest it into the ML pipeline.

## 1. Unity Environment Setup
1. Clone the repository: `git clone https://github.com/CapsuleEndoscope/VirtualCapsuleEndoscopy`
2. Open the project in Unity via Unity Hub.
3. Open the **Record Collect** scene from `VR-Caps-Unity/Assets/Scenes`. 

## 2. Generating Patient-Specific 3D Organs
To generate realistic biological variations:
1. Download anonymized DICOM data from datasets such as the Cancer Imaging Archive.
2. Use **InVesalius** to load the DICOM series and convert soft tissue structures to 3D surfaces (export as `.obj`).
3. Import the `.obj` into **Blender** and clean up the mesh (remove artifacts, close holes, join segments).
4. Use **MeshLab** (Quadric Edge Collapse Decimation) to simplify the mesh geometry count.
5. Import back into Unity under the `VR-Caps-Unity/Assets/Imported/Materials/Organs` path and assign the included organ material shaders.

## 3. Data Extraction using Unity Recorder
1. Open up the Unity Package Manager and ensure **Unity Recorder** is installed.
2. Attach the Virtual Capsule to a predefined spline path in the organ.
3. Open the Recorder Window. Add two new recorders:
   - **Image Sequence** (for RGB visual data). Base filename: `frame_<0000>`
   - **AOV Image Sequence** (for Depth Maps). 
4. Hit Play in Unity. The sequences will export to the configured directory (e.g., `unity_exports/RGB/` and `unity_exports/Depth/`).

## 4. Ingesting into the ML Pipeline
Once your synthetic dataset is exported, process it into a format compatible with `GalarCapsuleML` using the data integration script:

```bash
python data_pipeline.py --input_dir ./unity_exports --output_csv ./synthetic_data.csv --dataset_name vrcaps_run1
```

The script will map the metadata and output a one-hot encoded CSV file ready to be partitioned for ResNet/ViT training.
