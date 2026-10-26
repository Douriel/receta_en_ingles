from typing import List

from dto.ingredient import IngredientDto
from pydantic import BaseModel
from uuid import UUID

from bbdd_v3 import IngredientModel, RecipeModel, IngredientRecipeModel

class IngredientRecipeDto(BaseModel):
    unit: str
    quantity: int
    ingredient : IngredientDto

    @staticmethod
    def from_model(ingredientRecipeModel:IngredientRecipeModel):
        return IngredientRecipeDto(
                                    unit = ingredientRecipeModel.unit,
                                    quantity = ingredientRecipeModel.quantity,
                                    ingredient = IngredientDto.from_model(ingredientRecipeModel.ingredient))