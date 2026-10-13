import { Component, computed, OnInit, signal } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShoppingListDto } from '../../data/shoppingList.dto';
import { FormShListComponent } from '../../components/form-sh-list/form-sh-list.component';
import { nameExists } from '../../utils/validation.utils';

@Component({
  selector: 'app-shopping-list',
  imports: [NavBarComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss',
})
export class ShoppingListComponent implements OnInit{

  shoppingLists = signal<ShoppingListDto[]>([]);
  searchString = signal<string>("");
  ingNames = signal<string[]>([]);

  protected readonly shoppingListsAux = computed<ShoppingListDto[]>(() => {
    return this.shoppingLists().filter(shList => {
      if(!shList.name.toLocaleLowerCase().includes(this.searchString().toLocaleLowerCase()))
        return false;
      return true;
    })
  })


  constructor (
    private readonly restService: RestService,
    private readonly ngbModal: NgbModal)
  {}

  protected retrieveShoppingLists(): void {
    this.restService.getShoppingLists().subscribe({
      next: (list: ShoppingListDto[]) => this.shoppingLists.set(list),
      error: err => console.error('Failed to load shopping Lists', err)
    });
  }

  ngOnInit(): void {
    this.retrieveShoppingLists();
  }

  createShList() {
    const modalRef = this.ngbModal.open(FormShListComponent, {size:"lg"});
    modalRef.closed.subscribe({
      next: (shList: ShoppingListDto) => {
        this.restService.postShoppingList(shList).subscribe({
          next: () => {
            this.retrieveShoppingLists();
          },
          error: err => console.error('Shopping list could not be created', )
        })
      }
    })
  }
  editShList(shList: ShoppingListDto) {
    const modalRef = this.ngbModal.open(FormShListComponent, {size:"lg"});
    const modal: FormShListComponent = modalRef.componentInstance;
    modal.setShList(shList);

    modalRef.closed.subscribe({
      next: (result: ShoppingListDto | string) => {
        if(typeof result === "string"){
            this.restService.deleteShoppingList(result).subscribe({
              next: () => {
                this.retrieveShoppingLists();
              },
              error: err => console.error('Shopping List could not be deleted', err)
            })
        } else{
          this.restService.updateShoppingList(result).subscribe({
            next: () => {
              this.retrieveShoppingLists();
            },
            error: err => console.error('Shopping List could not be updated')
          })
        }
      }
    })
  }

  protected searchElement(element: string): void {
    this.searchString.set(element);
  }
}
