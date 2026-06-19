import { IngredientDto } from "./ingredient.dto";

export class RecipeDto {
    uuid: string = "";
    name: string = "";
    description: string = "";
    steps: string = "";
    ingredients: IngredientDto[] = [];

    constructor(recipe: Partial<RecipeDto> = {}){
        Object.assign(this, recipe);
    }
}