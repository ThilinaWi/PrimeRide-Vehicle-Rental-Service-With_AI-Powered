from fastapi import FastAPI
from model import VehiclePredictionModel
from pydantic import BaseModel

app = FastAPI()
model = VehiclePredictionModel()

class PredictionRequest(BaseModel):
    lastServiceDate: str
    mileage: int
    tireWear: int
    engineHealth: int
    brakeWear: int
    oilViscosity: int
    coolantLevel: int

@app.post("/predict")
async def predict(request: PredictionRequest):
    prediction = model.predict_next_service(
        request.lastServiceDate, request.mileage, request.tireWear, request.engineHealth, 
        request.brakeWear, request.oilViscosity, request.coolantLevel
    )
    return prediction
