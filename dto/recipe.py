from pydantic import BaseModel
from uuid import UUID

from BBDD import RecipeModel
from dto.ingredient import IngredientDto


class RecipeDto(BaseModel):
    uuid : str
    name : str
    description : str
    steps : str
    ingredients : list[IngredientDto]

    @staticmethod
    def from_model(recipe_model:RecipeModel):

        return RecipeDto(uuid = recipe_model.uuid,
                         name = recipe_model.name, 
                         description = recipe_model.description,
                         steps = recipe_model.steps,
                         ingredients = [IngredientDto.from_model(ingredient) for ingredient in recipe_model.ingredients])