from dto.tag import Tag_dto
from pydantic import BaseModel
from uuid import UUID

from bbdd_v2 import RecipeModel
from dto.ingredient import IngredientDto


class RecipeDto(BaseModel):
    uuid : str
    name : str
    time : int
    description : str
    steps : str
    ingredients : list[IngredientDto]
    tags : list[Tag_dto]

    @staticmethod
    def from_model(recipe_model:RecipeModel):
        return RecipeDto(uuid = recipe_model.uuid,
                         name = recipe_model.name,
                         time = recipe_model.time,
                         description = recipe_model.description,
                         steps = recipe_model.steps,
                         ingredients = [IngredientDto.from_model(ingredient) for ingredient in recipe_model.ingredients],
                         tags = [Tag_dto.from_model(tag) for tag in recipe_model.tags])