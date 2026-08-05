import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

@Component({
  selector: 'app-form-ingredient',
  imports: [],
  templateUrl: './form-ingredient.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './form-ingredient.component.scss'
})
export class FormIngredientComponent {

  constructor(protected readonly activeModal:NgbActiveModal){}

}
