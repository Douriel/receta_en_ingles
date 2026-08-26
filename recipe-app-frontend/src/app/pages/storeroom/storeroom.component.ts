import { Component, OnInit, signal } from '@angular/core';
import { IngredientDto } from '../../data/ingredient.dto';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { FormIngredientComponent } from '../../components/form-ingredient/form-ingredient.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-storeroom',
  imports: [NavBarComponent],
  templateUrl: './storeroom.component.html',
  styleUrls: ['./storeroom.component.scss']
})
export class StoreroomComponent implements OnInit {

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

  protected editIngredient(ingEdit: IngredientDto): void{
    const modalRef = this.ngbModal.open(FormIngredientComponent);
    const modal: FormIngredientComponent = modalRef.componentInstance;
    modal.setIng(ingEdit);

    modalRef.closed.subscribe({
      next: (result: IngredientDto | string) => {
        if(typeof result === "string"){
          this.restService.deleteIngredient(result).subscribe({
            next: () => {
              this.retrieveList();
            },
            error: err => console.error('Ingredient not deleted', err)
          })
        } else{
          this.restService.updateIngredient(result).subscribe({
            next: () => {
              this.retrieveList();
            },
            error: err => console.error('Ingredient not updated', err)
          })
        }
      }
    })
  }
}
