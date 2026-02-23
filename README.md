# SmartPill Command Center (v2.4.0)

![SmartPill Banner](docs/banner_placeholder.jpg)

**An end-to-end, medical AI integration platform for real-time robotic ingestible diagnostics.**

---

## 📖 Overview

SmartPill is a high-fidelity, advanced simulation UI combined with a hardware-ready deep-learning pipeline designed for ingestible capsule endoscopy. The project seamlessly integrates state-of-the-art super-resolution enhancement (`EndoL2H`) and precise disease classification (`GalarCapsuleML`) together under a single Next.js + FastAPI ecosystem.

## 🖼️ Gallery

### Cinematic Landing Page
![Landing Page](public/docs/landing_page.png)

### Live HUD Dashboard
![Dashboard](public/docs/dashboard.png)

### Genomic Surveillance & DNA Analysis
![DNA Analysis](public/docs/dna_analysis.png)

## ⚠️ Problem

Capsule endoscopy generates hundreds of thousands of frames that physicians must review. Current manual reviews take up to two hours per patient. The raw images retrieved from these low-power pills are often blurred, poorly illuminated, and feature significant visual artifacts (bubbles, debris, mucosal fold occlusions).

## 💡 Solution

We combine hardware constraints with software excellence:
1. **EndoL2H Super-Resolution:** Raw frames from the pill are automatically upscaled by 8x using our customized implementation of *EndoL2H*, turning blurry, dark images into high-resolution mucosal maps.
2. **GalarCapsuleML Inference:** A specifically-tuned ResNet-50 pipeline diagnoses the upscaled images in real time, detecting anomalies such as polyps, bleeding, ulcers, and predicting exact anatomical landmarks.
3. **Telemetric Command Dashboard:** A beautiful, responsive Next.js 14 HUD command center that mimics professional aerospace & medical UI. It displays raw telemetry (uptime, pH, temperature, pressure), DNA homology alignment predictions, and the real-time Endoscopic AI log.

## 🏗️ Architecture Stack

* **Frontend:** Next.js 14, React 18, Tailwind CSS, Framer Motion, Lucide Icons.
* **Backend:** FastAPI, Python 3.12, Uvicorn, WebSockets.
* **Inference Engine:** PyTorch, Pillow, OpenCV, EndoL2H, GalarCapsuleML.
* **Data Layer:** Local file-based JSON persistence engine designed for extreme scale testing portability.

## 📁 Project Structure

```text
xapi/
├── backend/
│   ├── main.py                    # FastAPI Entrypoint & Routes
│   ├── database.py                # Local JSON Persistence 
│   ├── models/                    # Model Wrappers
│   │   ├── endo_l2h_wrapper.py    # Interface for EndoL2H
│   │   └── galar_ml_wrapper.py    # Interface for ResNet50 Classifier
│   ├── weights/                   # (gitignored) PyTorch Weights .pth
│   └── uploads/                   # Local raw pill images processing
├── src/
│   ├── app/                       # Next.js App Router Structure
│   │   ├── page.tsx               # Cinematic Landing Page (Frame Sequence)
│   │   ├── dashboard/             # Live Telemetry Command Center
│   │   ├── analysis/              # Genomic & Diagnostics Subsystems
│   │   └── clinical/              # AI Processing Pipeline UI
│   ├── components/                # Modular Dashboard React Components
│   └── lib/                       # Typescript utils & standards
├── docs/                          # Architecture blueprints & logic guides
├── public/                        # Static assets, WebM media, Frames
├── package.json                   # Web Dependencies
└── requirements.txt               # Backend Dependencies
```

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have Node.js 20+ and Python 3.12 installed.

### 2. Backend Initialization (FastAPI)
```bash
# From the project root, navigate to the backend
cd backend

# Create a virtual environment and install dependencies
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# Start the server (Port 8000)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: If `weights/*.pth` are missing, the backend will dynamically simulate telemetry and AI generation states based on file seeds.*

### 3. Frontend Initialization (Next.js)
```bash
# From the project root, install NPM packages
npm install

# Run the dev server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` to access the SmartPill landing page and access the Command Dashboard!

## 🧪 Simulatability & AI Confidence Modeling

SmartPill uses sophisticated algorithms to dynamically render confidence visualizations within the UI logic:
* The DNA Match Widget builds sequences frame-by-frame and calculates mutation offsets on the fly.
* Missing PyTorch weights will gracefully fallback the FastAPI server into *Live Demo Pseudo-AI Generation mode*—simulating bounding box logic and percentage values so the UI always functions completely offline. Read more in `main_inference.py`.

## ⚖️ Regulatory Compliance & Privacy

This application is built as a **demonstration prototype**. It is expressly not HIPAA or GDPR certified for active clinical telemetry at this stage. End-to-end encryption (`AES-256-GCM`) markers displayed in the UI denote the *intended* production design for secure cloud deployment to patient hospitals.

---

*Designed and engineered by the Antigravity Bio-Intelligence Division.*
