import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseComponent} from './base/base.component';
import {FavouriteComponent} from './favourite/favourite.component';

const routes: Routes = [
  { path: 'Search', component: BaseComponent },
  { path: 'Favourite', component: FavouriteComponent },
  { path: '',   redirectTo: '/Search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
