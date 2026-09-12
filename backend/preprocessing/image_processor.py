from PIL import Image
import numpy as np


def preprocess_image(image: Image.Image):
    # Resize image to the size expected by MobileNetV3
    image = image.resize((224, 224))

    # Convert image to NumPy array
    image_array = np.array(image)

    # Add batch dimension: (224, 224, 3) → (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)

    return image_array