from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
import tensorflow as tf
import numpy as np
import io
from backend.database.database import SessionLocal
from backend.database.models import Prediction

from backend.rules.disposal_rules import get_disposal_guidance


app = FastAPI(
    title="AI-Based E-Waste Identification and Disposal Assistant"
)


# -----------------------------
# Load trained model
# -----------------------------

MODEL_PATH = "backend/model/e_waste_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)


# -----------------------------
# Model classes
# -----------------------------

CLASS_NAMES = [
    "battery",
    "computer_components",
    "mobile_accessories"
]


IMG_SIZE = (224, 224)

# Minimum confidence required
CONFIDENCE_THRESHOLD = 0.60


# -----------------------------
# Home API
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "E-Waste Assistant Backend is Running!"
    }


# -----------------------------
# Prediction API
# -----------------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Check file type
    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid JPG or PNG image."
        )

    # Read uploaded image
    contents = await file.read()

    try:
        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file."
        )

    # Resize image
    image = image.resize(IMG_SIZE)

    # Convert image to NumPy array
    image_array = np.array(image)

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # -----------------------------
    # Model prediction
    # -----------------------------

    predictions = model.predict(
        image_array,
        verbose=0
    )

    predicted_index = np.argmax(
        predictions[0]
    )

    predicted_class = CLASS_NAMES[
        predicted_index
    ]

    confidence = float(
        predictions[0][predicted_index]
    )
    # Log prediction to database
    # -----------------------------

    db = SessionLocal()
    try:
        prediction_record = Prediction(
            image_name=file.filename,
            predicted_category=predicted_class,
            confidence=confidence
        )
        db.add(prediction_record)
        db.commit()
    finally:
        db.close()

    # -----------------------------
    # Confidence check
    # -----------------------------

    if confidence >= CONFIDENCE_THRESHOLD:

        guidance = get_disposal_guidance(
            predicted_class
        )

        identified = True

    else:

        guidance = {
            "action": "Please verify the item manually and contact an authorized e-waste collection facility.",
            "safety_warning": "The system could not identify the item reliably.",
            "handling": "Keep the item safely stored until it can be identified."
        }

        identified = False


    # -----------------------------
    # Return result
    # -----------------------------

    return {
        "filename": file.filename,
        "identified": identified,
        "predicted_category": predicted_class,
        "confidence": round(
            confidence * 100,
            2
        ),
        "disposal_guidance": guidance
    }