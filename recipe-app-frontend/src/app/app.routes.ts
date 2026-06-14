import { Routes } from '@angular/router';
import { CookbookComponent } from './pages/cookbook/cookbook.component';
import { StoreroomComponent } from './pages/storeroom/storeroom.component';


export const routes: Routes = [
    {
        path: 'cookbook',
        component: CookbookComponent,
    },
    {
        path: 'storeroom',
        component: StoreroomComponent
    }
];
