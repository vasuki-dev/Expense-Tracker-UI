import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './topbar.html'
})
export class Topbar implements OnInit {
  userdetails: any;
  showProfile = false;
  profile: any = {};
  showProfileMenu = false;
  showLogoutDialog = false;
  showChangePassword = false;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.userdetails = JSON.parse(localStorage.getItem('userdetails') || '{}');
  }
  logout() {
    this.showLogoutDialog = false;
    this.router.navigate(['/login']);
    localStorage.clear();
  }
  goDash() {
    this.router.navigate(['/layout/dashboard']);
  }

  confirmLogout() {

    this.showProfileMenu = false;

    this.showLogoutDialog = true;

  }

  cancelLogout() {

    this.showLogoutDialog = false;

  }
  toggleProfileMenu() {

    this.showProfileMenu = !this.showProfileMenu;

  }
  openProfile() {

    this.showProfileMenu = false;

    this.profile = {

      ...this.userdetails

    };

    this.showProfile = true;

  }

  openPassword() {

    this.showProfileMenu = false;

    this.showChangePassword = true;

  }

  closePassword() {

    this.showChangePassword = false;

  }
}
