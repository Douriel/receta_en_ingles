from pydantic import BaseModel
from uuid import UUID

from BBDD import IngredientModel

class IngredientDto(BaseModel):
    uuid: str
    name: str
    quantity: int
    
    @staticmethod
    def from_model(ingredient_model:IngredientModel):

        return IngredientDto(uuid = ingredient_model.uuid, 
                             name = ingredient_model.name, 
                             quantity = ingredient_model.quantity)