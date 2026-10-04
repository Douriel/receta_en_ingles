import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CookbookComponent } from './pages/cookbook/cookbook.component';
import { StoreroomComponent } from './pages/pantry/storeroom.component';
import { TagsComponent } from './pages/tags/tags.component';
import { ShoppingListComponent } from './pages/shopping-list/shopping-list.component';



export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'cookbook',
        component: CookbookComponent,
        title: 'Cookbook for newbies'
    },
    {
        path: 'pantry',
        component: StoreroomComponent,
        title: 'Pantry'
    },
    {
        path: 'tags',
        component: TagsComponent,
        title: 'Tags manager'
    },
    {
        path: 'shopping-list',
        component: ShoppingListComponent,
        title: 'Shopping List'
    } 
];
