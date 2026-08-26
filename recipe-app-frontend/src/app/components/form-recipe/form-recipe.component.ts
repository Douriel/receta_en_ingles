import { Component, signal, OnInit } from '@angular/core';
import { applyEach, form, FormField, maxLength, min, required, SchemaPathTree } from '@angular/forms/signals';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { RecipeDto } from '../../data/recipe.dto';
import { IngredientDto } from '../../data/ingredient.dto';
import { debounceTime, distinctUntilChanged, filter, map, Observable, OperatorFunction } from 'rxjs';
import { RestService } from '../../services/rest.service';

interface Formdata{
  name: string;
  description: string;
  steps: string;
  ingredients: IngredientDto[];
}

function ItemSchema(ing: SchemaPathTree<IngredientDto>) {
  required(ing.name, {message: 'Item name is required'});
}

@Component({
  selector: 'app-form-recipe',
  imports: [FormField, NgbTypeahead],
  templateUrl: './form-recipe.component.html',
  styleUrl: './form-recipe.component.scss',
})
export class FormRecipeComponent implements OnInit {

  protected editFlag = false;

  ingNames = signal<string[]>([])

  constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  ngOnInit(): void {
    this.retrieveList();
  }

  protected retrieveList(): void {
    this.restService.getIngredientsNames().subscribe({
      next: (list: string[]) => this.ingNames.set(list),
      error: err => console.error('Failed to load ingredients', err)
    });
  }
  private readonly recipeModel = signal<Formdata>({
    name: "",
    description: "",
    steps: "",
    ingredients: []
  });

  protected readonly recipeForm = form(this.recipeModel, (schemaPath) =>{
    required(schemaPath.name);
    maxLength(schemaPath.name, 64);

    applyEach(schemaPath.ingredients, ItemSchema);
  });

  protected readonly modalTitle = signal("Write a new recipe");

  protected debugging(){
    console.log(this.recipeModel())
  }

  protected submitForm(){
    if(this.recipeForm().valid()){
      const recipeDto = new RecipeDto(this.recipeModel());
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

  deleteRow(index: number) {
    this.recipeForm.ingredients().value.update(value => value.filter((value, i) => i != index));
  }
  


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) =>
				term.length < 2 ? [] : this.ingNames().filter((v) => v.toLowerCase().includes(term.toLowerCase())).slice(0, 10),
			),
		);

}
