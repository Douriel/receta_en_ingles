import { Component, OnInit, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { RestService } from '../../services/rest.service';
import { form, required, FormField } from '@angular/forms/signals';
import { nameExists } from '../../utils/validation.utils';
import { TagDto } from '../../data/tag.dto';
import { T } from '@angular/cdk/keycodes';

interface Formdata{
  name: string;
}

@Component({
  selector: 'app-form-tag',
  imports: [FormField],
  templateUrl: './form-tag.component.html',
  styleUrl: './form-tag.component.scss',
})
export class FormTagComponent implements OnInit{

  tagNames = signal<string[]>([])
  protected readonly modalTitle = signal("New tag");
  protected editFlag = false;
  uuid: string = "";


  constructor(
    protected readonly activeModal:NgbActiveModal,
    private readonly restService: RestService
  ){}

  ngOnInit(): void {
    this.retrieveTagNameList();
  }

  private readonly tagModel = signal<Formdata>({
    name:""
  })

  protected readonly tagForm = form(this.tagModel, (schemaPath) =>{
    required(schemaPath.name);
    nameExists(schemaPath.name, this.tagNames, {message:"Tag name is already taken"});
  });

  protected retrieveTagNameList(): void{
    this.restService.getTagNames().subscribe({
      next: (list:string[]) => this.tagNames.set(list),
      error: err => console.error('Failed to load tag names', err)
    });
  }

  protected submitForm(){
    if(this.tagForm().valid()){
      console.log(this.tagModel());
      this.activeModal.close(new TagDto(this.tagModel()));
    }
  }

  protected deleteTag(){
    this.activeModal.close(this.uuid);
  }

  setTag(tagEdit: TagDto){
    this.editFlag = true;
    this.uuid = tagEdit.uuid;
    this.tagModel.set(tagEdit);
    this.modalTitle.set("Edit the tag");
  }
}

