from typing import List

from pydantic import BaseModel
from uuid import UUID

from bbdd_v2 import IngredientModel

class IngredientDto(BaseModel):
    uuid: str
    name: str
    quantity: int
    unit: str
    notes: str
    
    @staticmethod
    def from_model(ingredient_model:IngredientModel):

        return IngredientDto(uuid = ingredient_model.uuid, 
                             name = ingredient_model.name, 
                             quantity = ingredient_model.quantity,
                             unit= ingredient_model.unit,
                             notes= ingredient_model.notes)