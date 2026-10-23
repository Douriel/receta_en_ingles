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

  shoppingLists = signal<ShoppingListDto[]>([]);
  ingTitle = signal<string>("");
  ing = signal<IngredientDto|undefined>(undefined);

    constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  ngOnInit(): void {
    this.retrieveShList();
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

  setModal(ing: IngredientDto){
    this.ing.set(ing)
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
      })
      // It might save the same ingredient multiple times
      shList.ingredients.push(ingShListDto)
      this.activeModal.close(shList)
    }
  }

}
