import { Component, signal } from '@angular/core';
import { form, FormField, maxLength, min, required } from '@angular/forms/signals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipeDto } from '../../data/recipe.dto';
import { IngredientDto } from '../../data/ingredient.dto';

interface Formdata{
  name: string;
  description: string;
  steps: string;
  ingredients: IngredientDto[];
}

@Component({
  selector: 'app-form-recipe',
  imports: [FormField],
  templateUrl: './form-recipe.component.html',
  styleUrl: './form-recipe.component.scss',
})
export class FormRecipeComponent {

  protected editFlag = false;

  constructor(protected readonly activeModal:NgbActiveModal){}

  private readonly recipeModel = signal<Formdata>({
    name: "",
    description: "",
    steps: "",
    ingredients: []
  });

  protected readonly recipeForm = form(this.recipeModel, (schemaPath) =>{
    required(schemaPath.name);
    maxLength(schemaPath.name, 64);
  });

  protected readonly modalTitle = signal("Write a new recipe");

  protected debugging(){
    console.log(this.recipeModel())
  }

  protected submitForm(){
    if(this.recipeForm().valid()){
      const recipeDto = new RecipeDto(this.recipeModel());
      let flag = true;
      do{
        if(recipeDto.ingredients[recipeDto.ingredients.length -1].name == ""){
          this.recipeForm.ingredients().value().pop();
        } else{
          flag =false;
        }
      } while(flag);
      this.activeModal.close(recipeDto);
    }
  }

  protected deleteRec() {
    const recipeDto = new RecipeDto(this.recipeModel());
    this.activeModal.close(recipeDto.uuid);
  }

  setRecipe(recipeEdit: RecipeDto) {
    this.editFlag = true;
    this.recipeModel.set(recipeEdit);
    this.modalTitle.set("Edit the recipe");
  }

  addIng() {
    const ingDto = new IngredientDto();
    this.recipeForm.ingredients().value.update(value => [...value, ingDto]);
  }

  deleteLastRow() {
    this.recipeForm.ingredients().value().pop();
    //const test = this.recipeForm.ingredients().value().pop();
    //const found = test.find(ing => ing.name == "")

    //console.log(found);
  }

}
