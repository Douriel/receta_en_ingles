from typing import List

from pydantic import BaseModel
from uuid import UUID

from BBDD import IngredientModel, TagModel

class TagDto(BaseModel):
    uuid: str
    name: str
    
    @staticmethod
    def from_model(tag_model:TagModel):

        return TagDto(uuid = tag_model.uuid, 
                             name = tag_model.name)