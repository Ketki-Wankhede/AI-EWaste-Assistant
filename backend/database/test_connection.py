from backend.database.database import engine, Base
from backend.database.models import Prediction

try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
except Exception as e:
    print("Table creation failed!")
    print(e)