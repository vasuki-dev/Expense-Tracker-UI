import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../service/expense_service';


@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.html',
  imports: [ReactiveFormsModule]
})
export class ExpenseForm implements OnChanges {

  @Input() editData: any;
  @Output() close = new EventEmitter();
  form!: FormGroup;

  constructor(private fb: FormBuilder,
    private service: ExpenseService) {
    this.form = this.fb.group({
      date: [''],
      category: [''],
      amount: [''],
      note: [''],
      file: ['']
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && changes['editData'].currentValue) {

      if (!this.form) return;
      this.form.patchValue({
        date: this.formatDate(this.editData.date),
        category: this.editData.category,
        amount: this.editData.amount,
        note: this.editData.note
      });
      //   this.formControls['date'].setValue(this.editData?.date);
      //   this.formControls['category'].setValue(this.editData?.category);
      //   this.formControls['amount'].setValue(this.editData?.amount);
      //   this.formControls['note'].setValue(this.editData?.note);
    }

  }

  formatDate(date: string) {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }
  ngOnInit() {

  }

  save() {

    if (this.editData) {

      this.service.updateExpense(
        this.editData.id,
        this.form.value
      )

    } else {

      this.service.addExpense({
        id: Date.now(),
        ...this.form.value
      })

    }

    this.close.emit()

  }

  get formControls() {
    return this.form.controls;
  }
}