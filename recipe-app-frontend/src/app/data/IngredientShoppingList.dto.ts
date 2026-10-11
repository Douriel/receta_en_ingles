import { IngredientDto } from './ingredient.dto';
export class IngredientShoppongListDto {
    unit: string = "";
    quantity: number = 0;
    ingredient: IngredientDto = new IngredientDto();

    constructor(ingShopL: Partial<IngredientShoppongListDto> = {}){
        Object.assign(this, ingShopL);
    }
}