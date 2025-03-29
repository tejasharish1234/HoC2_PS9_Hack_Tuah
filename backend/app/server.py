from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.prescription_verifier import PrescriptionVerifier  # Ensure correct import
import os

# Initialize FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ Allow frontend
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # ✅ Allow all headers
)

# Resolve absolute CSV path
current_dir = os.path.dirname(os.path.abspath(__file__))  # Get `app/` directory
base_dir = os.path.dirname(current_dir)  # Go up to `backend/`
csv_path = os.path.join(base_dir, "data", "drug_interactions.csv")

# Validate CSV existence
if not os.path.exists(csv_path):
    raise FileNotFoundError(f"Drug interactions CSV not found at {csv_path}")

# Initialize Prescription Verifier with CSV path
verifier = PrescriptionVerifier(csv_path)

# Request model
class PrescriptionRequest(BaseModel):
    new_prescription: list[str]
    past_prescriptions: list[str]

# API Endpoint for verification
@app.post("/verify")
async def verify_prescription(request: PrescriptionRequest):
    try:
        print("Received request:", request.dict())  # Debugging line
        interactions = verifier.verify_prescription(
            request.new_prescription, request.past_prescriptions
        )
        print("Returning response:", interactions)  # Debugging line
        return {"interactions": interactions}
    except Exception as e:
        print("Error:", str(e))  # Debugging line
        raise HTTPException(status_code=500, detail=str(e))

# Run FastAPI server when executing the script directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
