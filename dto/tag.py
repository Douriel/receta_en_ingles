from typing import List

from pydantic import BaseModel
from uuid import UUID

from BBDD import IngredientModel

class TagDto(BaseModel):
    uuid: str
    name: str
    
    @staticmethod
    def from_model(ingredient_model:IngredientModel):

        return TagDto(uuid = ingredient_model.uuid, 
                             name = ingredient_model.name)