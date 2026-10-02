import { Component, computed, OnInit, signal } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { TagDto } from '../../data/tag.dto';
import { RestService } from '../../services/rest.service';


@Component({
  selector: 'app-tags',
  imports: [NavBarComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent implements OnInit {
createTag() {
throw new Error('Method not implemented.');
}
  tags = signal<TagDto[]>([]);
  searchString = signal<string>("");


    constructor (
    private readonly restService: RestService)
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
      if(!tag.name.includes(this.searchString().toLowerCase()))
        return false;
      return true;
    })
  })

  protected searchElement(element: string): void {
    this.searchString.set(element);
  }

}
