from pydantic import BaseModel
from uuid import UUID


class RecipeDto(BaseModel):
    recipe_uuid : str
    name : str
    description : str
    steps : str
    ingredients : list