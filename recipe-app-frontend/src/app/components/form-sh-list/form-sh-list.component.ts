import { Component, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-form-sh-list',
  imports: [],
  templateUrl: './form-sh-list.component.html',
  styleUrl: './form-sh-list.component.scss',
})
export class FormShListComponent {
  modalTitle = signal<string>("Create a new List");

    constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}
}
