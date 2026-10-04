import { IngredientDto } from "./ingredient.dto";

export class ShoppingListDto{
    uuid: string = "";
    name: string = "";
    ingredients : IngredientDto[] = [];
    quantity: number = 0;
    unit: string = "";
    notes: string = "";
    
    constructor(shoppingList: Partial<ShoppingListDto> = {}){
        Object.assign(this, shoppingList);
    }
}