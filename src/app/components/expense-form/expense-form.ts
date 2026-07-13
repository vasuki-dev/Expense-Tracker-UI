import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../service/expense_service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.html',
  imports: [ReactiveFormsModule, CommonModule]
})
export class ExpenseForm implements OnInit, OnChanges {

  @Input() editData: any;
  @Output() close = new EventEmitter();
  form!: FormGroup;
  selectedFile: File | null = null;

  isSubmitting = false;
  categoryList: any[] = [];
  userdetails: any;
  constructor(private fb: FormBuilder,
    private service: ExpenseService, private cdr: ChangeDetectorRef, private toast: ToastrService) {
    this.form = this.fb.group({
      date: [
        '',
        Validators.required
      ],

      category: [
        '',
        Validators.required
      ],

      amount: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      note: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250)
        ]
      ],
      file: ['']

    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && changes['editData'].currentValue) {

      if (!this.form) return;
      this.form.patchValue({
        date: this.formatDate(this.editData.date),
        category: String(this.editData.category),
        amount: this.editData.amount,
        note: this.editData.note
      });
      //   this.formControls['date'].setValue(this.editData?.date);
      //   this.formControls['category'].setValue(this.editData?.category);
      //   this.formControls['amount'].setValue(this.editData?.amount);
      //   this.formControls['note'].setValue(this.editData?.note);
    }

  }
  // patchForm() {

  //   this.form.patchValue({

  //     date: this.editData.date,

  //     category: this.editData.category,

  //     amount: this.editData.amount,

  //     note: this.editData.note

  //   });

  // }

  formatDate(date: string) {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }
  ngOnInit() {
    this.userdetails = JSON.parse(localStorage.getItem('userdetails') || '{}');
    this.getCategoryList();
  }
  getCategoryList() {
    this.service.categoryList().subscribe({
      next: (res: any) => {
        this.categoryList = res?.response ?? [];
        console.log(this.categoryList, '-----------> category list');
        if (this.editData) {

          this.form.patchValue({
            category: this.editData.category
          });

        }
        this.cdr.markForCheck();
      }
    })
  }
  onFileChange(event: any) {

    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
    }

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.isSubmitting = true;

    const formData = new FormData();

    formData.append('date', this.form.value.date);

    formData.append('category', this.form.value.category);

    formData.append('amount', this.form.value.amount);

    formData.append('note', this.form.value.note);
    formData.append('user_code', this.userdetails.userCode)
    if (this.editData) {
      formData.append('_id', this.editData?._id);
    }
    if (this.selectedFile) {

      formData.append(
        'file',
        this.selectedFile
      );

    }

    if (this.editData) {

      this.updateExpense(formData);

    } else {

      this.addExpense(formData);

    }

  }

  addExpense(formData: FormData) {

    this.service
      .addExpense(formData)
      .subscribe({

        next: (res: any) => {

          this.isSubmitting = false;
          this.toast.success(res?.message || 'Expense added successfully');
          this.close.emit();
          this.reloadExpenseList();
        },

        error: () => {

          this.isSubmitting = false;

        }

      });

  }

  updateExpense(formData: FormData) {

    this.service
      .updateExpense(
        formData
      )
      .subscribe({

        next: (res: any) => {

          this.isSubmitting = false;
          this.toast.success(res?.message || 'Expense updated successfully');
          this.close.emit();
          this.reloadExpenseList();
        },

        error: () => {

          this.isSubmitting = false;

        }

      });

  }
  reloadExpenseList() {
    let data = {
      userCode: this.userdetails?.userCode
    }
    this.service.expenseList(data, true);
  }
  get formControls() {
    return this.form.controls;
  }
}