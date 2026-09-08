from typing import List

from dto.ingredient_shopping_list import Ingredient_shopping_list_dto
from dto.ingredient import IngredientDto
from pydantic import BaseModel
from uuid import UUID

from bbdd_v2 import IngredientModel, ShoppingListModel

class ShoppingListDto(BaseModel):
    uuid: str
    name: str
    notes: str
    ingredients : list[Ingredient_shopping_list_dto]
    
    
    @staticmethod
    def from_model(shoppingList_model:ShoppingListModel):
        print(shoppingList_model.ingredients)
        return ShoppingListDto(uuid = shoppingList_model.uuid, 
                            name = shoppingList_model.name,
                            notes= shoppingList_model.notes,
                            ingredients=[Ingredient_shopping_list_dto.from_model(assoc) for assoc in shoppingList_model.ingredients]
                            )
                            