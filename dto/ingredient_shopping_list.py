from typing import List

from dto.ingredient import IngredientDto
from pydantic import BaseModel
from uuid import UUID

from bbdd_v2 import IngredientModel, ShoppingListModel, IngredientShoppingListModel

class IngredientShoppingListDto(BaseModel):
    unit: str
    quantity: int
    ingredient : IngredientDto

    @staticmethod
    def from_model(ingredientShoppingListModel:IngredientShoppingListModel):
        return IngredientShoppingListDto(
                                            unit = ingredientShoppingListModel.unit,
                                            quantity = ingredientShoppingListModel.quantity,
                                            ingredient = IngredientDto.from_model(ingredientShoppingListModel.ingredient))