from typing import List

from pydantic import BaseModel
from uuid import UUID

from bbdd_v2 import IngredientModel, TagModel

class Tag_dto(BaseModel):
    uuid: str
    name: str
    
    @staticmethod
    def from_model(tag_model:TagModel):

        return Tag_dto(uuid = tag_model.uuid, 
                             name = tag_model.name)