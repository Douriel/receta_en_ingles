from typing import List

from dto.ingredient import IngredientDto
from pydantic import BaseModel
from uuid import UUID

from BBDD import IngredientModel, ShoppingListModel

class ShoppingListDto(BaseModel):
    uuid: str
    name: str
    ingredients : list[IngredientDto]
    notes: str
    
    @staticmethod
    def from_model(shoppingList_model:ShoppingListModel):
        return ShoppingListDto(uuid = shoppingList_model.uuid, 
                            name = shoppingList_model.name,
                            notes= shoppingList_model.notes,
                            ingredients = [IngredientDto.from_model(ingredient) for ingredient in shoppingList_model.ingredients])