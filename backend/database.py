import json
import os
from datetime import datetime
import uuid

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

MISSIONS_FILE = os.path.join(DATA_DIR, "missions.json")
PATIENTS_FILE = os.path.join(DATA_DIR, "patients.json")
SETTINGS_FILE = os.path.join(DATA_DIR, "settings.json")

def load_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path, "r") as f:
        try:
            return json.load(f)
        except:
            return default

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=4)

# --- MISSIONS ---
def get_missions():
    return load_json(MISSIONS_FILE, [])

def add_mission(mission_data):
    missions = get_missions()
    mission_data["id"] = str(uuid.uuid4())
    mission_data["timestamp"] = datetime.now().isoformat()
    missions.insert(0, mission_data)
    save_json(MISSIONS_FILE, missions)
    return mission_data

# --- PATIENTS ---
def get_patients():
    return load_json(PATIENTS_FILE, [
        {
            "id": "PX-99284",
            "name": "John Doe",
            "age": 45,
            "status": "In-Progress",
            "last_exam": "2024-02-20",
            "findings": "Suspected erosion in duodenum"
        },
        {
            "id": "PX-88123",
            "name": "Jane Smith",
            "age": 32,
            "status": "Completed",
            "last_exam": "2024-02-15",
            "findings": "Normal"
        }
    ])

def update_patient(patient_id, data):
    patients = get_patients()
    for p in patients:
        if p["id"] == patient_id:
            p.update(data)
            save_json(PATIENTS_FILE, patients)
            return p
    return None

# --- SETTINGS ---
def get_settings():
    return load_json(SETTINGS_FILE, {
        "telemetry_rate": 5,
        "ai_auto_process": True,
        "emergency_stop_protocol": "Standard",
        "operator_id": "SR-472"
    })

def update_settings(data):
    settings = get_settings()
    settings.update(data)
    save_json(SETTINGS_FILE, settings)
    return settings
