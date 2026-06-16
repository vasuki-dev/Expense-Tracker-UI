import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class Registration {
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)],
      confirmPassword: ['', Validators.required],
    })
  }
  get formControl() {
    return this.registerForm.controls;
  }
  submit() {
    if (this.registerForm.invalid) {
      return this.registerForm.markAllAsTouched();
    }
    if(this.formControl['password'] !== this.formControl['confirmPassword']){
      alert('Passwords do not match');
    }
    console.log(this.registerForm.value, ':::::::: Form value');
  }
}
