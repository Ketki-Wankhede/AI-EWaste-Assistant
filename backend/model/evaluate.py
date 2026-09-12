import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report

TEST_DIR = "dataset_split/test"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16

# Load test dataset
test_dataset = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

# Load trained model
model = tf.keras.models.load_model(
    "backend/model/e_waste_model.keras"
)

# Get class names
class_names = test_dataset.class_names

print("Classes:", class_names)

# Evaluate
loss, accuracy = model.evaluate(test_dataset)

print("\nTest Accuracy:", accuracy)
print("Test Loss:", loss)

# Generate predictions
y_true = []
y_pred = []

for images, labels in test_dataset:

    predictions = model.predict(images, verbose=0)

    predicted_classes = np.argmax(predictions, axis=1)

    y_true.extend(labels.numpy())
    y_pred.extend(predicted_classes)

# Classification report
print("\nClassification Report:")
print(
    classification_report(
        y_true,
        y_pred,
        target_names=class_names
    )
)