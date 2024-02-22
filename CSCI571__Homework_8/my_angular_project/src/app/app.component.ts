import { R3TemplateDependencyKind } from '@angular/compiler';
import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import axios from 'axios';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
 

}

