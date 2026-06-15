import { Routes } from '@angular/router';
import { CookbookComponent } from './pages/cookbook/cookbook.component';
import { StoreroomComponent } from './pages/storeroom/storeroom.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'cookbook',
        component: CookbookComponent,
        title: 'Cookbook for newbies'
    },
    {
        path: 'storeroom',
        component: StoreroomComponent,
        title: 'Storeroom'
    }    
];
