import { Component, OnInit, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../services/rest.service';
import { ShoppingListDto } from '../../data/shoppingList.dto';
import { IngredientShoppongListDto } from '../../data/IngredientShoppingList.dto';
import { IngredientDto } from '../../data/ingredient.dto';

interface Formdata{
  name: string;
  notes: string;
  ingredients: IngredientShoppongListDto[];
}

@Component({
  selector: 'app-form-sh-list',
  imports: [],
  templateUrl: './form-sh-list.component.html',
  styleUrl: './form-sh-list.component.scss',
})
export class FormShListComponent implements OnInit {
  modalTitle = signal<string>("Create a new List");

  protected editFlag = false;
  private uuid: string = "";
  ingNames = signal<string[]>([]);
  shoppingLists = signal<string[]>([]);



  constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  private readonly shListModel = signal<Formdata>({
    name:"",
    notes:"",
    ingredients:[]
  })

  ngOnInit(): void {
    this.retrieveListIng();
  }

  protected deleteShList() {
    this.activeModal.close(this.uuid);
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
        this.shoppingLists.set(list)
        if(this.editFlag)
          this.shoppingLists.update(names => names.filter(name => this.shListModel().name !== name))
      },
      error: err => console.error('Failed to load shopping List names', err)
    });
  }

}
