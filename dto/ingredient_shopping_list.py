from typing import List

from dto.ingredient import IngredientDto
from pydantic import BaseModel
from uuid import UUID

from bbdd_v2 import IngredientModel, ShoppingListModel, IngredientShoppingListModel

class Ingredient_shopping_list_dto(BaseModel):
    unit: str
    quantity: int
    ingredient : list[IngredientDto]

    @staticmethod
    def from_model(ingredientShoppingListModel:IngredientShoppingListModel):
        return Ingredient_shopping_list_dto(
                                            unit = ingredientShoppingListModel.unit,
                                            quantity = ingredientShoppingListModel.quantity,
                                            ingredient = [IngredientDto.from_model(ingredient) for ingredient in ingredientShoppingListModel.ingredient])