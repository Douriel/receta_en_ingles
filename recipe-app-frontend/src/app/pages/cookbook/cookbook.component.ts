import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { readonly } from '@angular/forms/signals';
import { RestService } from '../../services/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipeDto } from '../../data/recipe.dto';

@Component({
  selector: 'app-cookbook',
  imports: [RouterLink, NavBarComponent],
  templateUrl: './cookbook.component.html',
  styleUrl: './cookbook.component.scss'
})
export class CookbookComponent implements OnInit{

  recipeBook = signal<RecipeDto[]>([]);

  constructor (
    private readonly restService: RestService,
    private readonly ngbModal: NgbModal)
    {}

  ngOnInit(): void {
    this.recipeList();
  }
  
  protected recipeList(): void{
    this.restService.getRecipes().subscribe({
      next: (list: RecipeDto[]) => this.recipeBook.set(list),
      error: err => console.error('Failed to load recipes', err)
    })
  }

  createRecipe() {
    throw new Error('Method not implemented.');
  }
}
