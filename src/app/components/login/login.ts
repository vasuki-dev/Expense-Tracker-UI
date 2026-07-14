import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { loginService } from '../../service/login_service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = signal('');
  password = signal('');
  submitted = signal(false);

  // ✅ validation rules
  usernameError = computed(() => {
    if (!this.submitted()) return '';
    if (!this.username()) return 'Username is required';
    if (this.username().length < 3) return 'Minimum 3 characters';
    return '';
  });

  passwordError = computed(() => {
    if (!this.submitted()) return '';
    if (!this.password()) return 'Password is required';
    if (this.password().length < 6) return 'Minimum 6 characters';
    return '';
  });

  // ✅ overall form valid
  isFormValid = computed(() => {
    return this.username() && this.password() &&
      this.username().length >= 3 &&
      this.password().length >= 6;
  });
  constructor(private router: Router, private authService: loginService, private toast: ToastrService) { }
  login() {
    this.submitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    const payload = {
      userName: this.username(),
      password: this.password()
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        // ✅ store tokens
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('userdetails', JSON.stringify(res.userdetails));
        // redirect
        this.router.navigate(['/layout/dashboard']);
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Login failed');
        console.error('Login failed', err);
      }
    });
  }
}
