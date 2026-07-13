import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [RouterOutlet],
  templateUrl: './topbar.html'
})
export class Topbar {
  constructor(private router: Router) { }
  logout() {
    this.router.navigate(['/login']);
    localStorage.clear();
  }
  goDash(){
    this.router.navigate(['/layout/dashboard']);
  }
}
