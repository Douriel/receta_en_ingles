import { IngredientDto } from "./ingredient.dto";
import { TagDto } from "./tag.dto";

export class RecipeDto {
    uuid: string = "";
    name: string = "";
    description: string = "";
    steps: string = "";
    ingredients: IngredientDto[] = [];
    tags: TagDto[] = [];

    constructor(recipe: Partial<RecipeDto> = {}){
        Object.assign(this, recipe);
    }
}