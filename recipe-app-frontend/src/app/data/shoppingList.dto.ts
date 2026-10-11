import { IngredientDto } from "./ingredient.dto";
import { IngredientShoppongListDto } from "./IngredientShoppingList.dto";

export class ShoppingListDto{
    uuid: string = "";
    name: string = "";
    notes: string = "";
    ingredients : IngredientShoppongListDto[] = [];

    constructor(shoppingList: Partial<ShoppingListDto> = {}){
        Object.assign(this, shoppingList);
    }
}