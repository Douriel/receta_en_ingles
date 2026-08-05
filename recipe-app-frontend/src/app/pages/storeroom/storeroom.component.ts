import { Component, OnInit, signal, Signal } from '@angular/core';
import { IngredientDto } from '../../data/ingredient.dto';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-storeroom',
  imports: [],
  templateUrl: './storeroom.component.html',
  styleUrls: ['./storeroom.component.scss']
})
export class StoreroomComponent implements OnInit {

  //ingredientList: IngredientDto[] = [];
  ingredientList = signal<IngredientDto[]>([])

  constructor(private readonly restService: RestService) { }
  
  ngOnInit(): void {
    this.retrieveList();
  }

  protected retrieveList(): void {
    this.restService.getIngredients().subscribe({
      next: (list: IngredientDto[]) => this.ingredientList.set(list),
      error: err => console.error('Failed to load ingredients', err)
    });
  }
}
