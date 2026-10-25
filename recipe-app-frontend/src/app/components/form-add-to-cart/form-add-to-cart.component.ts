import { Component, OnInit, signal } from '@angular/core';
import { form, FormField, required, SchemaPath } from '@angular/forms/signals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgSelectComponent } from '@ng-select/ng-select';
import { RestService } from '../../services/rest.service';
import { ShoppingListDto } from '../../data/shoppingList.dto';
import { IngredientDto } from '../../data/ingredient.dto';
import { IngredientShoppongListDto } from '../../data/IngredientShoppingList.dto';

interface Formdata{
  shListName: string;
  unit: string;
  quantity: number;
}

@Component({
  selector: 'app-form-add-to-cart',
  imports: [FormField, NgSelectComponent],
  templateUrl: './form-add-to-cart.component.html',
  styleUrl: './form-add-to-cart.component.scss',
})
export class FormAddToCartComponent implements OnInit{
debugging() {
throw new Error('Method not implemented.');
}

  shoppingLists = signal<ShoppingListDto[]>([]);
  shoppingListsName = signal<string[]>([]);
  unitNames = signal<string[]>([]);
  ingTitle = signal<string>("");
  ing = signal<IngredientDto|undefined>(undefined);

    constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  ngOnInit(): void {
    this.retrieveShList();
    this.retrieveShListNames();
    this.retrieveListUnits();
  }

  private readonly addToCartModel = signal<Formdata>({
    shListName: "",
    unit: "",
    quantity: 0
  })

  protected readonly addToCartForm = form(this.addToCartModel, (schemaPath) => {
    required(schemaPath.shListName)
  })

  protected retrieveShList(): void {
    this.restService.getShoppingLists().subscribe({
      next: (list: ShoppingListDto[]) => this.shoppingLists.set(list),
      error: err => console.error('Failed to load shopping lists', err)
    });
  }
  protected retrieveShListNames(): void {
    this.restService.getShoppingListsNames().subscribe({
      next: (list: string[]) => this.shoppingListsName.set(list),
      error: err => console.error('Failed to load shopping lists', err)
    });
  }
  protected retrieveListUnits(): void {
    this.restService.getUnitsNames().subscribe({
      next: (list: string[]) => this.unitNames.set(list),
      error: err => console.error('Failed to load units names', err)
    });
  }

  setModal(ing: IngredientDto){
    this.ing.set(ing)
    this.ingTitle.set(ing.name)
    this.addToCartModel.set({
      shListName: "",
      unit: ing.unit,
      quantity: ing.quantity
    });
  }

  protected submitForm(){
    if(this.addToCartForm().valid()){
      const shList: ShoppingListDto =  this.shoppingLists().find(shListName => shListName.name === this.addToCartModel().shListName)!
      const ingShListDto = new IngredientShoppongListDto({
        ingredient: this.ing(),
        unit: this.addToCartModel().unit,
        quantity: this.addToCartModel().quantity
      });
      // It might save the same ingredient multiple times
      //console.log(ingShListDto)
      shList.ingredients.push(ingShListDto);
      console.log(shList.ingredients)
      this.activeModal.close(shList);
    }
  }

}
