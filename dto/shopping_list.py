from typing import List

from dto.ingredient import IngredientDto
from pydantic import BaseModel
from uuid import UUID

from BBDD import IngredientModel

class ShoppingListDto(BaseModel):
    uuid: str
    name: str
    ingredients : list[IngredientDto]
    quantity: int
    unit: str
    notes: str
    
    @staticmethod
    def from_model(ingredient_model:IngredientModel):

        return ShoppingListDto(uuid = ingredient_model.uuid, 
                             name = ingredient_model.name, 
                             quantity = ingredient_model.quantity,
                             unit= ingredient_model.unit,
                             notes= ingredient_model.notes)