export class IngredientDto {
    uuid: string = "";
    name: string = "";
    quantity: number = 0;
    unit: string = "";
    notes: string = "";

    constructor(ingredient: Partial<IngredientDto> = {}){
        Object.assign(this, ingredient);
    }
}