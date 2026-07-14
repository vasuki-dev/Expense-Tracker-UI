import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { loginService } from '../../service/login_service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupForm!: FormGroup;
  submitted = false;
  showPolicy = false;

  constructor(private fb: FormBuilder, private authService: loginService, private toast: ToastrService) {
    this.signupForm = this.fb.group({

      fullName: ['', Validators.required],

      userName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      mobile: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],

      confirmPassword: ['', Validators.required],

      acceptTerms: [false, Validators.requiredTrue]

    },
      {
        validators: this.passwordMatchValidator
      });
  }
  get f() {
    return this.signupForm.controls;
  }
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {

    const password = group.get('password')?.value;

    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {

      group.get('confirmPassword')?.setErrors({
        passwordMismatch: true
      });

      return {
        passwordMismatch: true
      };

    }

    return null;

  }
  signup() {

    this.submitted = true;

    if (this.signupForm.invalid) {

      this.signupForm.markAllAsTouched();

      return;

    }

    const data = {

      fullName: this.f['fullName'].value,

      userName: this.f['userName'].value,

      email: this.f['email'].value,

      mobile: this.f['mobile'].value,

      password: this.f['password'].value

    };

    this.authService.signup(data).subscribe({

      next: (res: any) => {

        return this.toast.success(res?.message, 'Success');

      },
      error: (err: any) => {
        return this.toast.error(err?.message, 'Error');
      }

    });

  }

  openPolicy() {

    this.showPolicy = true;

  }

  closePolicy() {

    this.showPolicy = false;

  }
}
