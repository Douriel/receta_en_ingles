from pydantic import BaseModel
from uuid import UUID

from BBDD import IngredientModel

class IngredientDto(BaseModel):
    ingredient_id: str
    ingredient_name: str
    quantity: int

    def __init__(self, ingredientModel: IngredientModel):
        super().__init__(
            ingredient_id=ingredientModel.id,
            ingredient_name=ingredientModel.name,
            quantity=ingredientModel.quantity
        )
    