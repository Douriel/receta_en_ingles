import { Component, OnInit, signal } from '@angular/core';
import { form, FormField, maxLength, min, required } from '@angular/forms/signals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IngredientDto } from '../../data/ingredient.dto';
import { nameExists } from '../../utils/validation.utils';
import { RestService } from '../../services/rest.service';
import { NgSelectComponent } from '@ng-select/ng-select';

interface Formdata{
  name: string;
  quantity: number;
  unit: string;
  notes: string;
}


@Component({
  selector: 'app-form-ingredient',
  imports: [FormField, NgSelectComponent],
  templateUrl: './form-ingredient.component.html',
  styleUrl: './form-ingredient.component.scss'
})
export class FormIngredientComponent implements OnInit{

  protected editFlag = false;
  ingNames = signal<string[]>([])
  unitNames = signal<string[]>([]);

  constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  ngOnInit(): void {
    this.retrieveListIng();
    this.retrieveListUnits();
  }

  protected retrieveListIng(): void {
    this.restService.getIngredientsNames().subscribe({
      next: (list: string[]) => {
        this.ingNames.set(list)
        if(this.editFlag)
          this.ingNames.update(names => names.filter(name => this.ingModel().name !== name))
      },
      error: err => console.error('Failed to load ingredients names', err)
    });
  }

  protected retrieveListUnits(): void {
    this.restService.getUnitsNames().subscribe({
      next: (list: string[]) => this.unitNames.set(list),
      error: err => console.error('Failed to load units names', err)
    });
  }

  private readonly ingModel = signal<Formdata>({
    name: "",
    quantity: 0,
    unit: "",
    notes: ""
  });

  protected readonly ingForm = form(this.ingModel, (schemaPath) =>{
    required(schemaPath.name);
    maxLength(schemaPath.name, 64);
    nameExists(schemaPath.name, this.ingNames, {message:"Recipe name is already taken"});

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


