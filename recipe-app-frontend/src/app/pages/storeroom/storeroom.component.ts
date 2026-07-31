import { Component } from '@angular/core';
import { IngredientDto } from '../../data/ingredient.dto';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-storeroom',
  imports: [],
  templateUrl: './storeroom.component.html',
  styleUrl: './storeroom.component.scss'
})
export class StoreroomComponent {

  constructor(private readonly restService: RestService) { }
  
  protected retrieveList(){
    this.restService.getIngredients()
  }
}
