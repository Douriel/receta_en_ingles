import { Component, OnInit, signal, Signal, ChangeDetectionStrategy } from '@angular/core';
import { IngredientDto } from '../../data/ingredient.dto';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { FormIngredientComponent } from '../../components/form-ingredient/form-ingredient.component';

@Component({
  selector: 'app-storeroom',
  imports: [],
  templateUrl: './storeroom.component.html',
  styleUrls: ['./storeroom.component.scss']
})
export class StoreroomComponent implements OnInit {

  //ingredientList: IngredientDto[] = [];
  ingredientList = signal<IngredientDto[]>([])

  constructor(
    private readonly restService: RestService,
    private readonly ngbModal: NgbModal
    ) { }
  
  ngOnInit(): void {
    this.retrieveList();
  }

  protected retrieveList(): void {
    this.restService.getIngredients().subscribe({
      next: (list: IngredientDto[]) => this.ingredientList.set(list),
      error: err => console.error('Failed to load ingredients', err)
    });
  }

  protected createIngredient(): void {
    const modalRef = this.ngbModal.open(FormIngredientComponent);
    modalRef.closed.subscribe({
      next: (ingDto: IngredientDto) => {
        this.restService.postIngredient(ingDto).subscribe({
          next: () => {
            this.retrieveList();
          },
          error: err => console.error('Ingredient not created', err)
        })
      }
    })
  }
}
