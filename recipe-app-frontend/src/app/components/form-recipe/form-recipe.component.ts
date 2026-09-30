import { Component, signal, OnInit } from '@angular/core';
import { applyEach, form, FormField, maxLength, min, required, SchemaPathTree } from '@angular/forms/signals';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { RecipeDto } from '../../data/recipe.dto';
import { IngredientDto } from '../../data/ingredient.dto';
import { debounceTime, distinctUntilChanged, filter, map, Observable, OperatorFunction } from 'rxjs';
import { RestService } from '../../services/rest.service';
import { TagDto } from '../../data/tag.dto';
import { nameExists } from '../../utils/validation.utils';

interface Formdata{
  name: string;
  mins: number;
  hours: number;
  description: string;
  steps: string;
  ingredients: IngredientDto[];
  tags: TagDto[];
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
  tagNames = signal<string[]>([])
  recipeNames = signal<string[]>([])

  private uuid: string = "";

  constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  ngOnInit(): void {
    this.retrieveListIng();
    this.retrieveListTag();
    this.retrieveListRecipe();
  }

  protected timeConversionLoading(totalMins : number): void{
    if(totalMins>=60){
      this.recipeForm.hours().value.update(hours => hours+1);
      totalMins -= 60;
      this.timeConversionLoading(totalMins);
    }
    else{
      this.recipeForm.mins().value.update(mins => totalMins);
    }
  }

  protected retrieveListIng(): void {
    this.restService.getIngredientsNames().subscribe({
      next: (list: string[]) => this.ingNames.set(list),
      error: err => console.error('Failed to load ingredients names', err)
    });
  }
  protected retrieveListTag(): void {
    this.restService.getTagNames().subscribe({
      next: (list: string[]) => this.tagNames.set(list),
      error: err => console.error('Failed to load Tags names', err)
    });
  }

  protected retrieveListRecipe(): void {
    this.restService.getRecipesNames().subscribe({
      next: (list: string[]) => {
        this.recipeNames.set(list)
        if(this.editFlag)
          this.recipeNames.update(names => names.filter(name => this.recipeModel().name !== name)) 
      },
      error: err => console.error('Failed to load recipe names', err)
    });
  }
  private readonly recipeModel = signal<Formdata>({
    name: "",
    mins: 0,
    hours: 0,
    description: "",
    steps: "",
    ingredients: [],
    tags: []
  });

  private itemSchema(ing: SchemaPathTree<IngredientDto>) {
    required(ing.name, {message: 'Item name is required'});
  }
  protected readonly recipeForm = form(this.recipeModel, (schemaPath) =>{
    required(schemaPath.name);
    nameExists(schemaPath.name, this.recipeNames, {message:"Recipe name is already taken"});
    maxLength(schemaPath.name, 64);
    applyEach(schemaPath.ingredients, this.itemSchema);
    min(schemaPath.mins, 0);
    min(schemaPath.hours, 0);
  });

  protected readonly modalTitle = signal("Write a new recipe");

  protected debugging(){
    console.log(this.recipeModel())
  }

  protected submitForm(){
    if(this.recipeForm().valid()){
      const data = this.recipeModel();
      console.log("Submiting the form")
      console.log(data.hours*60+data.mins)
      const recipeDto = new RecipeDto({
        uuid: this.uuid,
        name: data.name,
        time: data.hours*60+data.mins,
        description: data.description,
        steps: data.steps,
        ingredients: data.ingredients,
        tags: data.tags
      });
      this.activeModal.close(recipeDto);
    }
  }

  protected deleteRec() {
    this.activeModal.close(this.uuid);
  }
  setRecipe(recipeEdit: RecipeDto) {
    this.editFlag = true;
    this.uuid = recipeEdit.uuid
    this.recipeModel.set({
      name: recipeEdit.name,
      mins: 0,
      hours: 0,
      description: recipeEdit.description,
      steps: recipeEdit.steps,
      ingredients: recipeEdit.ingredients,
      tags: recipeEdit.tags
    });
    this.timeConversionLoading(recipeEdit.time);
    this.modalTitle.set("Edit the recipe");
  }

  addIng() {
    const ingDto = new IngredientDto();
    this.recipeForm.ingredients().value.update(value => [...value, ingDto]);
  }

  addTag() {
    const tagDto = new TagDto();
    this.recipeForm.tags().value.update(value => [...value, tagDto]);
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
				term.length < 2 ? [] : this.ingNames().filter((v) => v.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
			),
		);

  searchTags: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) =>
				term.length < 2 ? [] : this.tagNames().filter((v) => v.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
			),
		);

}
