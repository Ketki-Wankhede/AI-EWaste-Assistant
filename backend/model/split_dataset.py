import os
import random
import shutil

SOURCE_DIR = "dataset"
OUTPUT_DIR = "dataset_split"

CLASSES = [
    "battery",
    "mobile_accessories",
    "computer_components"
]

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

random.seed(42)


for class_name in CLASSES:

    source_class_dir = os.path.join(SOURCE_DIR, class_name)

    images = [
        file for file in os.listdir(source_class_dir)
        if file.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    random.shuffle(images)

    total = len(images)

    train_end = int(total * TRAIN_RATIO)
    val_end = train_end + int(total * VAL_RATIO)

    train_images = images[:train_end]
    val_images = images[train_end:val_end]
    test_images = images[val_end:]

    for split_name, split_images in [
        ("train", train_images),
        ("validation", val_images),
        ("test", test_images)
    ]:

        destination_dir = os.path.join(
            OUTPUT_DIR,
            split_name,
            class_name
        )

        os.makedirs(destination_dir, exist_ok=True)

        for image in split_images:
            source_path = os.path.join(source_class_dir, image)
            destination_path = os.path.join(destination_dir, image)

            shutil.copy2(source_path, destination_path)

    print(
        f"{class_name}: "
        f"{len(train_images)} train, "
        f"{len(val_images)} validation, "
        f"{len(test_images)} test"
    )

print("\nDataset split completed successfully!")