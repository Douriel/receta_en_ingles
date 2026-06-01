from pydantic import BaseModel
from uuid import UUID


class RecipeDto(BaseModel):
    recipe_id : str
    name : str
    description : str
    steps : str
    ingredients : list