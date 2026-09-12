import tensorflow as tf
import numpy as np
from PIL import Image

MODEL_PATH = "backend/model/e_waste_model.keras"
IMAGE_PATH = r"C:\Users\ketaki\Desktop\Ewaste-Assistent\dataset_split\test\battery\battery_1.jpg"

IMG_SIZE = (224, 224)

# Class names in the same order used during training
CLASS_NAMES = [
    "battery",
    "computer_components",
    "mobile_accessories"
]

# Load trained model
model = tf.keras.models.load_model(MODEL_PATH)

# Open image
image = Image.open(IMAGE_PATH).convert("RGB")

# Resize image
image = image.resize(IMG_SIZE)

# Convert image to NumPy array
image_array = np.array(image)

# Add batch dimension
image_array = np.expand_dims(image_array, axis=0)

# Make prediction
predictions = model.predict(image_array, verbose=0)

# Get predicted class
predicted_index = np.argmax(predictions[0])

# Get confidence
confidence = predictions[0][predicted_index]

predicted_class = CLASS_NAMES[predicted_index]

print("\nPrediction Result")
print("-----------------")
print("Predicted Category:", predicted_class)
print("Confidence:", round(float(confidence) * 100, 2), "%")