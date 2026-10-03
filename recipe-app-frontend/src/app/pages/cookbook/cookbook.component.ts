import { Component, signal, OnInit, computed } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { RecipeDto } from '../../data/recipe.dto';
import { FormRecipeComponent } from '../../components/form-recipe/form-recipe.component';
import { NgSelectComponent } from '@ng-select/ng-select'
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-cookbook',
  imports: [NavBarComponent, NgbCollapse, NgSelectComponent, NgxSliderModule, FormsModule],
  templateUrl: './cookbook.component.html',
  styleUrl: './cookbook.component.scss'
})

export class CookbookComponent implements OnInit{

  recipeBook = signal<RecipeDto[]>([]);
  searchString = signal<string>("");
  tagNames = signal<string[]>([]);
  ingNames = signal<string[]>([]);
  filterTags = signal<string[]>([]);
  filterIngs = signal<string[]>([]);
  readonly isCollapsed = signal(true);


  // Double slider selector varibles:
  value = signal<number>(0);
  highValue = signal<number>(241);
  options: Options = {
    showTicks: true,
    hideLimitLabels: true,
    hidePointerLabels: true,
    minRange: 1,
    stepsArray: [
      {value:0, legend:"0m"},
      {value:15, legend:"15m"}, 
      {value:30, legend:"30m"},
      {value:45, legend:"45m"},
      {value:60, legend:"1h"},
      {value:120, legend:"2h"},
      {value:180, legend: "3h"},
      {value:240, legend: "4h"},
      {value:241, legend: "Any"}
    ]
  }
  
  protected readonly recipeBookAux = computed<RecipeDto[]>(() => {
    return this.recipeBook().filter(recipe => {
      if(!recipe.name.toLocaleLowerCase().includes(this.searchString().toLocaleLowerCase()))
        return false;
      if(!this._filterTags(recipe.tags.map(tag => tag.name), this.filterTags()))
        return false;
      if(!this._filterIngs(recipe.ingredients.map(ing => ing.name), this.filterIngs()))
        return false;
      if(recipe.time < this.value())
        return false;
      if(this.highValue() != 241 && recipe.time >= this.highValue())
        return false;      
      return true;
    })
  })

  private _filterTags(recipeTags:string[], filterTags:string[]){
    //Devolvemos true si todos los tags del filtro estan en la receta.
    return filterTags.every(filterTag => recipeTags.includes(filterTag));
  }
  private _filterIngs(recipeIng:string[], filterIng:string[]){
    //Devolvemos true si todos los Ingredientes del filtro estan en la receta.
    return filterIng.every(filterIng => recipeIng.includes(filterIng));
  }

  constructor (
    private readonly restService: RestService,
    private readonly ngbModal: NgbModal)
    {}

  ngOnInit(): void {
    this.retriveRecipeList();
    this.retrieveListIng();
    this.retrieveListTag();
  }
  
  protected retriveRecipeList(): void{
    this.restService.getRecipes().subscribe({
      next: (list: RecipeDto[]) => {
        this.recipeBook.set(list);
        console.log(this.recipeBook())
      },
      error: err => console.error('Failed to load recipes', err)
    })
  }
  protected retrieveListIng(): void {
    this.restService.getIngredientsNames().subscribe({
      next: (list: string[]) => this.ingNames.set(list),
      error: err => console.error('Failed to load ingredients', err)
    });
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
    this.searchString.set(element);
  }

  
  
}
