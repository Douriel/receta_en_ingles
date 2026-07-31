import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IngredientDto } from '../data/ingredient.dto';

@Injectable({providedIn: 'root'})
export class RestService {
    constructor(private httpClient: HttpClient) { }

    public getIngredients(){
        this.httpClient.get<IngredientDto[]>('http://127.0.0.1:8000/ingredient').subscribe({
            next: (list) => {console.log(list)}
        });
    }

    public getIngredient(){
        this.httpClient.get<IngredientDto>('http://127.0.0.1:8000/ingredient/')
    }
}