import { Component, computed, OnInit, signal } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { TagDto } from '../../data/tag.dto';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormTagComponent } from '../../components/form-tag/form-tag.component';
import { errorContext } from 'rxjs/internal/util/errorContext';


@Component({
  selector: 'app-tags',
  imports: [NavBarComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent implements OnInit {
  tags = signal<TagDto[]>([]);
  searchString = signal<string>("");

    constructor (
    private readonly restService: RestService,
    private readonly ngbModal: NgbModal)
    {}
  ngOnInit(): void {
    this.retrieveTagList();
  }

  protected retrieveTagList(): void{
    this.restService.getTags().subscribe({
      next: (list: TagDto[]) => {
        this.tags.set(list);
      },
      error: err => console.error('Filed to load tags', err)
    })
  }
  
  protected readonly tagsAux = computed<TagDto[]>(() => {
    return this.tags().filter(tag => {
      if(!tag.name.toLocaleLowerCase().includes(this.searchString().toLocaleLowerCase()))
        return false;
      return true;
    })
  })

  protected searchElement(element: string): void {
    console.log(element);
    this.searchString.set(element);
  }

  protected createTag(): void{
    const modalRef = this.ngbModal.open(FormTagComponent);
    modalRef.closed.subscribe({
      next: (tagDto : TagDto) => {
        this.restService.postTag(tagDto).subscribe({
          next: () => this.retrieveTagList(),
          error: err => console.error('Tag could not be created', err)
        })
      }
    })
  }

  protected editTag(tagEdit: TagDto): void{
    const modalRef = this.ngbModal.open(FormTagComponent);
    const modal: FormTagComponent = modalRef.componentInstance;
    modal.setTag(tagEdit);

    modalRef.closed.subscribe({
      next: (result: TagDto | string) => {
        if(typeof result === "string"){
          this.restService.deleteTag(result).subscribe({
            next: () => this.retrieveTagList(),
            error: err => console.error('Tag could not be deleted', err)
          })
        } else{
          this.restService.updateTag(result).subscribe({
            next: () => this.retrieveTagList(),
            error: err => console.error("Tag could not be updated", err)
          })
        }
      }
    })
  }



}
