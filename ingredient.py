from pydantic import BaseModel
from uuid import UUID

from BBDD import IngredientModel

class IngredientDto(BaseModel):
    id: str
    name: str
    quantity: int
    
    @staticmethod
    def from_model(ingredient_model:IngredientModel):
        return IngredientDto(id = ingredient_model.id, 
                             name = ingredient_model.name, 
                             quantity = ingredient_model.quantity)