import { Component, inject, OnInit } from '@angular/core';
import { loaderService } from '../../service/loader_service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  constructor(public loaderservice: loaderService) { }
}
