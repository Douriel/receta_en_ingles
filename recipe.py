from pydantic import BaseModel
from uuid import UUID

from BBDD import RecipeModel


class RecipeDto(BaseModel):
    uuid : str
    name : str
    description : str
    steps : str
    ingredients : list

    @staticmethod
    def from_model(recipe_model:RecipeModel):

        return RecipeDto(uuid = recipe_model.uuid,
                         name = recipe_model.name, 
                         description = recipe_model.description,
                         steps = recipe_model.steps,
                         ingredients = recipe_model.ingredients)