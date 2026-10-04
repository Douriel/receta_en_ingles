import { Component, OnInit, signal } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shopping-list',
  imports: [NavBarComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss',
})
export class ShoppingListComponent implements OnInit{

  ingNames = signal<string[]>([]);

  
  constructor (
    private readonly restService: RestService,
    private readonly ngbModal: NgbModal)
  {}

  protected retrieveListIng(): void {
    this.restService.getIngredientsNames().subscribe({
      next: (list: string[]) => this.ingNames.set(list),
      error: err => console.error('Failed to load ingredients', err)
    });
  }  
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  createShList() {
    throw new Error('Method not implemented.');
  }

  searchElement(arg0: string) {
    throw new Error('Method not implemented.');
  }

  editShList(_t16: any) {
    throw new Error('Method not implemented.');
  }
}
