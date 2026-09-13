import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { form, FormField, readonly } from '@angular/forms/signals';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { RecipeDto } from '../../data/recipe.dto';
import { FormRecipeComponent } from '../../components/form-recipe/form-recipe.component';
import { NgSelectComponent } from '@ng-select/ng-select'
import { TagDto } from '../../data/tag.dto';



interface Formdata{
  name: string;
}
 
@Component({
  selector: 'app-cookbook',
  imports: [RouterLink, NavBarComponent, NgbCollapse, NgSelectComponent, FormField],
  templateUrl: './cookbook.component.html',
  styleUrl: './cookbook.component.scss'
})

export class CookbookComponent implements OnInit{

  recipeBook = signal<RecipeDto[]>([]);
  recipeBookAux = signal<RecipeDto[]>([]);
  tagNames = signal<string[]>([]);
  readonly isCollapsed = signal(true);

  private tagModel = signal<Formdata>({
    name: ""
  });

  protected readonly tagForm = form(this.tagModel);

  constructor (
    private readonly restService: RestService,
    private readonly ngbModal: NgbModal)
    {}

  ngOnInit(): void {
    this.retriveRecipeList();
    this.retrieveListTag();
  }
  
  protected retriveRecipeList(): void{
    this.restService.getRecipes().subscribe({
      next: (list: RecipeDto[]) => {
        this.recipeBook.set(list);
        this.recipeBookAux.set(list);
      },
      error: err => console.error('Failed to load recipes', err)
    })
  }
  protected retrieveListTag(): void {
    this.restService.getTagNames().subscribe({
      next: (list: string[]) => this.tagNames.set(list),
      error: err => console.error('Failed to load Tags', err)
    });
  }
  protected createRecipe(): void {
    const modalRef = this.ngbModal.open(FormRecipeComponent);
    modalRef.closed.subscribe({
      next: (recDto : RecipeDto) => {
        this.restService.postRecipe(recDto).subscribe({
          next: () => {
            this.retriveRecipeList();
          },
          error: err => console.error('Recipe could not be created', err)
        })
      }
    })
  }

  protected editRecipe(recipeEdit: RecipeDto): void{
    const modalRef = this.ngbModal.open(FormRecipeComponent);
    const modal: FormRecipeComponent = modalRef.componentInstance;
    modal.setRecipe(recipeEdit);

    modalRef.closed.subscribe({
      next: (result: RecipeDto | string) => {
        if(typeof result === "string"){
          this.restService.deleteRecipe(result).subscribe({
            next: () => {
              this.retriveRecipeList();
            },
            error: err => console.error('Recipe could not be deleted', err)
          })
        } else{
          this.restService.updateRecipe(result).subscribe({
            next: () => {
              this.retriveRecipeList();
            },
            error: err => console.error('Recipe could not be updated', err)
          })
        }
      }
    })
  }

  protected searchElement(element: string): void {
    this.recipeBookAux.set(this.recipeBook().filter(recipe => {
      return recipe.name.toLowerCase().includes(element.toLowerCase());
    })); 
  }

  
}
