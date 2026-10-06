from dto.ingredient_shopping_list import IngredientShoppingListDto
from dto.ingredient import IngredientDto
from pydantic import BaseModel
from uuid import UUID

from bbdd_v2 import IngredientModel, ShoppingListModel

class ShoppingListDto(BaseModel):
    uuid: str
    name: str
    notes: str
    ingredients : list[IngredientShoppingListDto]
    
    
    @staticmethod
    def from_model(shoppingList_model:ShoppingListModel):
        print(shoppingList_model.ingredients)
        return ShoppingListDto(uuid = shoppingList_model.uuid, 
                            name = shoppingList_model.name,
                            notes= shoppingList_model.notes,
                            ingredients=[IngredientShoppingListDto.from_model(assoc) for assoc in shoppingList_model.ingredients]
                            )