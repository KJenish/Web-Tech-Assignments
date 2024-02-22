import { Component } from '@angular/core';
// import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent {
  favorites: any[] = [];
  displayerr = false;
  displayfav = true;

  ngAfterViewInit() {
    const prefix = 'favorite_';
    for (let key in localStorage) {
      if (key.startsWith(prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          this.favorites.push(JSON.parse(value));
        }
      }
    }
    this.displayerr = this.favorites.length === 0;
    this.displayfav = !this.displayerr;
  }
  

  async getfavoritedata() {
    const prefix = 'favorite_';
    this.favorites = [];
    for (let key in localStorage) {
      if (key.startsWith(prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          const favorite = JSON.parse(value);
          this.favorites.push(favorite);
        }
      }
    }
    console.log("code inside get function",this.favorites);
  }

  async removefavoritedata(id: string) {
    const index = this.favorites.findIndex(f => f.id === id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    localStorage.removeItem(`favorite_${id}`);
    this.displayerr = this.favorites.length === 0;
    this.displayfav = !this.displayerr;
    alert('Removed from favorites!');
  }
  

}
