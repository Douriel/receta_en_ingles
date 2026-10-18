import { Component, OnInit, signal } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../services/rest.service';
import { ShoppingListDto } from '../../data/shoppingList.dto';
import { IngredientShoppongListDto } from '../../data/IngredientShoppingList.dto';
import { IngredientDto } from '../../data/ingredient.dto';
import { applyEach, form, FormField, maxLength, required, SchemaPathTree } from '@angular/forms/signals';
import { nameExists } from '../../utils/validation.utils';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';


interface Formdata{
  name: string;
  notes: string;
  ingredients: IngredientShoppongListDto[];
}

@Component({
  selector: 'app-form-sh-list',
  imports: [FormField, NgbTypeahead],
  templateUrl: './form-sh-list.component.html',
  styleUrl: './form-sh-list.component.scss',
})
export class FormShListComponent implements OnInit {
  modalTitle = signal<string>("Create a new List");

  protected editFlag = false;
  private uuid: string = "";
  ingNames = signal<string[]>([]);
  shoppingListsNames = signal<string[]>([]);



  constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  private readonly shListModel = signal<Formdata>({
    name:"",
    notes:"",
    ingredients:[]
  })

  private itemSchema(ing: SchemaPathTree<IngredientShoppongListDto>) {
    required(ing.ingredient.name, {message: 'Item name is required'});
  }
  protected readonly shListForm = form(this.shListModel, (schemaPath) => {
    required(schemaPath.name);
    nameExists(schemaPath.name, this.shoppingListsNames, {message:"Recipe name is already taken"});
    maxLength(schemaPath.name, 64);
    applyEach(schemaPath.ingredients, this.itemSchema);
  });

  ngOnInit(): void {
    this.retrieveListIng();
  }

  protected submitForm(){
    if(this.shListForm().valid()){
      const shListDto = new ShoppingListDto(this.shListModel())
      shListDto.uuid = this.uuid;
      this.activeModal.close(shListDto)
    }
  }
/*
    protected submitForm(){
    if(this.shListForm().valid()){
      const data = this.shListModel();
      const shListDto = new ShoppingListDto({
        uuid: this.uuid,
        name: data.name,
        notes: data.notes,
        ingredients: data.ingredients
      })
      console.log(shListDto)
      this.activeModal.close(shListDto)
    }
  }
    */

  protected deleteShList() {
    this.activeModal.close(this.uuid);
  }

  protected debugging(){
    //console.log(this.recipeModel())
  }

  setShList(shList: ShoppingListDto){
    this.editFlag =true;
    this.uuid = shList.uuid;
    this.shListModel.set({
      name: shList.name,
      notes: shList.notes,
      ingredients: shList.ingredients
    });
    this.modalTitle.set("Edit shopping List");
  }

  protected retrieveListIng(): void {
    this.restService.getIngredientsNames().subscribe({
      next: (list: string[]) => this.ingNames.set(list),
      error: err => console.error('Failed to load ingredients names', err)
    });
  }

  protected retrieveShoppingLists(): void {
    this.restService.getShoppingListsNames().subscribe({
      next: (list: string[]) => {
        this.shoppingListsNames.set(list)
        if(this.editFlag)
          this.shoppingListsNames.update(names => names.filter(name => this.shListModel().name !== name))
      },
      error: err => console.error('Failed to load shopping List names', err)
    });
  }

  addIng() {
    const ingShDto = new IngredientShoppongListDto();
    this.shListForm.ingredients().value.update(value => [...value, ingShDto]);
  }
  deleteRowIng(index: number) {
    this.shListForm.ingredients().value.update(value => value.filter((value, i) => i != index));
  }

    search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2 ? [] : this.ingNames().filter((v) => v.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
      ),
    );
}
