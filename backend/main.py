from fastapi import FastAPI
from backend.routes import clothing  # Import clothing routes

app = FastAPI()

app.include_router(clothing.router, prefix="/clothing", tags=["Clothing"])

@app.get("/")
def home():
    return {"message": "Welcome to Outfitly API!"}
