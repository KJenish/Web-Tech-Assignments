import { Component,Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data.center.lat);
  }

  mapOptions: google.maps.MapOptions = {
    center:{lat: parseFloat(this.data.center.lat),lng:parseFloat(this.data.center.lng)}
    
  }
  marker= {
    position:{lat: parseFloat(this.data.center.lat),lng:parseFloat(this.data.center.lng)}
  }
}
