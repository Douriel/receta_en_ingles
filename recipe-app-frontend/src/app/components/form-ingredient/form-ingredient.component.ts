import { Component, signal } from '@angular/core';
import { form, FormField, maxLength, min, required } from '@angular/forms/signals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IngredientDto } from '../../data/ingredient.dto';

interface Formdata{
  name: string;
  quantity: number;
  unit: string;
  notes: string; 
}


@Component({
  selector: 'app-form-ingredient',
  imports: [FormField],
  templateUrl: './form-ingredient.component.html',
  styleUrl: './form-ingredient.component.scss'
})
export class FormIngredientComponent {

  protected editFlag = false;

  constructor(protected readonly activeModal:NgbActiveModal){}

  private readonly ingModel = signal<Formdata>({
    name: "",
    quantity: 0,
    unit: "",
    notes: ""
  });

  protected readonly ingForm = form(this.ingModel, (schemaPath) =>{
    required(schemaPath.name);
    maxLength(schemaPath.name, 64);
    maxLength(schemaPath.unit, 16);
    maxLength(schemaPath.notes, 200);
    min(schemaPath.quantity, 0);
  });

  protected readonly modalTitle = signal("Create a new ingredient");

  protected debugging(){
    console.log(this.ingModel())
  }

  protected submitForm(){
    if(this.ingForm().valid()){
      const ingDto = new IngredientDto(this.ingModel());
      this.activeModal.close(ingDto);
    }
  }

  protected deleteIng() {
    const ingDto = new IngredientDto(this.ingModel());
    this.activeModal.close(ingDto.uuid);
  }

  public setIng(ingEdit: IngredientDto){
    this.editFlag = true;
    this.ingModel.set(ingEdit);
    this.modalTitle.set("Edit the ingredient");
  }
}


