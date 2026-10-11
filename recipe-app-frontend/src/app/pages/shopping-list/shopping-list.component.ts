import { Component, computed, OnInit, signal } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShoppingListDto } from '../../data/shoppingList.dto';

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
    throw new Error('Method not implemented.');
  }

  protected searchElement(element: string): void {
    this.searchString.set(element);
  }

  editShList(_t16: any) {
    throw new Error('Method not implemented.');
  }
}
