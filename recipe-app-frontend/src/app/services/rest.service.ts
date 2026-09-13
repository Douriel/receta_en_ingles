import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IngredientDto } from '../data/ingredient.dto';
import { Observable } from 'rxjs';
import { RecipeDto } from '../data/recipe.dto';
import { TagDto } from '../data/tag.dto';

@Injectable({providedIn: 'root'})
export class RestService {
    constructor(private httpClient: HttpClient) { }

    // Services from Ingredientes

    public getIngredients(): Observable<IngredientDto[]> {
        return this.httpClient.get<IngredientDto[]>('http://127.0.0.1:8000/ingredient');
    }

    public getIngredientsNames(): Observable<string[]> {
        return this.httpClient.get<string[]>('http://127.0.0.1:8000/ingredient/names');
    }

    public postIngredient(newIngredient: IngredientDto){
        return this.httpClient.post<any>('http://127.0.0.1:8000/ingredient', newIngredient);
    }

    public updateIngredient(updatedIngredient: IngredientDto){
        return this.httpClient.put<any>(`http://127.0.0.1:8000/ingredient/${updatedIngredient.uuid}`, updatedIngredient);
    }

    public deleteIngredient(uuidIng: string){
        return this.httpClient.delete<any>(`http://127.0.0.1:8000/ingredient/${uuidIng}`);
    }

    // Services from RecipeBook

    public getRecipes(): Observable<RecipeDto[]>{
        return this.httpClient.get<RecipeDto[]>('http://127.0.0.1:8000/recipe');
    }

    public postRecipe(newRecipe: RecipeDto) {
      return this.httpClient.post<any>('http://127.0.0.1:8000/recipe', newRecipe)
    }

    public updateRecipe(updatedRecipe: RecipeDto){
        return this.httpClient.put<any>(`http://127.0.0.1:8000/recipe/${updatedRecipe.uuid}`, updatedRecipe);
    }

    public deleteRecipe(deletedRecipeUUID: string){
        return this.httpClient.delete<any>(`http://127.0.0.1:8000/recipe/${deletedRecipeUUID}`)
    }

    // Services from Tags
    public getTags(): Observable<TagDto[]> {
        return this.httpClient.get<TagDto[]>('http://127.0.0.1:8000/tag');
    }

    public getTagNames(): Observable<string[]> {
        return this.httpClient.get<string[]>('http://127.0.0.1:8000/tag/names');
    }

    public postTag(newTag: TagDto){
        return this.httpClient.post<any>('http://127.0.0.1:8000/tag', newTag);
    }

    // Upadate is missing
    public updateTag(updatedTag: TagDto){
        return this.httpClient.put<any>(`http://127.0.0.1:8000/tag/${updatedTag.uuid}`, updatedTag);
    }

    public deleteTag(uuidTag: string){
        return this.httpClient.delete<any>(`http://127.0.0.1:8000/tag/${uuidTag}`);
    }
}