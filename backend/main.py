from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf
import numpy as np
import io

from backend.rules.disposal_rules import get_disposal_guidance


app = FastAPI(
    title="AI-Based E-Waste Identification and Disposal Assistant"
)


# --------------------------------------------------
# CORS - Allow React frontend
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Model Configuration
# --------------------------------------------------

MODEL_PATH = "backend/model/e_waste_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = [
    "battery",
    "computer_components",
    "mobile_accessories"
]

IMG_SIZE = (224, 224)

CONFIDENCE_THRESHOLD = 0.60


# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "E-Waste Assistant Backend is Running!"
    }


# --------------------------------------------------
# Prediction Route
# --------------------------------------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Check file type
    if file.content_type not in [
        "image/jpeg",
        "image/png"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG and PNG images are allowed."
        )

    try:
        # Read uploaded file
        contents = await file.read()

        # Open image
        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        # Resize image
        image = image.resize(IMG_SIZE)

        # Convert image to NumPy array
        image_array = np.array(image)

        # Add batch dimension
        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # Normalize pixel values
        image_array = image_array / 255.0

        # Make prediction
        predictions = model.predict(
            image_array,
            verbose=0
        )

        # Find predicted class
        predicted_index = int(
            np.argmax(predictions[0])
        )

        predicted_class = CLASS_NAMES[
            predicted_index
        ]

        # Get confidence
        confidence = float(
            predictions[0][predicted_index]
        )

        confidence_percentage = round(
            confidence * 100,
            2
        )

        # Check confidence threshold
        identified = (
            confidence >= CONFIDENCE_THRESHOLD
        )

        # Get disposal guidance
        if identified:
            guidance = get_disposal_guidance(
                predicted_class
            )
        else:
            guidance = {
                "action": "Manual verification required.",
                "safety_warning": (
                    "The AI prediction confidence is low. "
                    "Do not dispose of the item based only "
                    "on this prediction."
                ),
                "handling": (
                    "Keep the item safely stored and "
                    "consult an authorized e-waste "
                    "collection or recycling facility."
                )
            }

        # Return result
        return {
            "filename": file.filename,
            "identified": identified,
            "predicted_category": predicted_class,
            "confidence": confidence_percentage,
            "disposal_guidance": guidance
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )
