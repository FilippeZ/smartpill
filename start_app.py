import subprocess
import os
import sys
import time

def run_production_app():
    print("🚀 Starting Capsule Endoscopy AI System...")
    
    # 1. Start FastAPI Backend
    print("📡 Launching ML Processing Backend...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd="backend"
    )
    
    # 2. Start Next.js Frontend
    print("💻 Launching Command Center Frontend...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=".",
        shell=True
    )
    
    print("\n✅ System active at:")
    print("   Frontend: http://localhost:3001")
    print("   Backend:  http://localhost:8000")
    print("\nPress Ctrl+C to terminate both servers.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        backend_process.terminate()
        frontend_process.terminate()

if __name__ == "__main__":
    run_production_app()
