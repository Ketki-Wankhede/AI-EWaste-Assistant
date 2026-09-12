# E-Waste Dataset Documentation

## Project
AI-Based E-Waste Identification and Disposal Assistant

## Target Classes

1. Charger
2. Cable
3. Earphones
4. Battery
5. Mobile Accessories
6. Computer Components

## Dataset Strategy

The project uses publicly available e-waste/electronics image datasets.
Relevant categories will be selected, cleaned, and reorganized
according to the project's six target classes.

Additional images may be collected where a target class has
insufficient suitable samples.

## Preprocessing

- Remove irrelevant images
- Remove duplicate/poor-quality images
- Standardize image format
- Resize images for model input
- Apply augmentation during training
- Split data into training, validation and testing sets

## Model

MobileNetV3 using transfer learning.
