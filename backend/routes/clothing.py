from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter()

# Sample data storage
clothing_items = []

# Clothing Model
class Clothing(BaseModel):
    name: str
    category: str
    color: str

# Add Clothing
@router.post("/")
def add_clothing(item: Clothing):
    new_item = {
        "id": str(uuid.uuid4()),
        "name": item.name,
        "category": item.category,
        "color": item.color
    }
    clothing_items.append(new_item)
    return new_item

# Get All Clothing
@router.get("/")
def get_clothing():
    return clothing_items
