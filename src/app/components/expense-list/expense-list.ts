import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ExpenseForm } from '../expense-form/expense-form';
@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, ExpenseForm],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList {
  // receive expenses from dashboard
  openForm!: boolean;
  expenses = [
    {
      date: '2026-04-01',
      category: 'Food',
      amount: 250,
      note: 'Lunch',
      bill: 'https://via.placeholder.com/150'
    },
    {
      date: '2026-04-02',
      category: 'Travel',
      amount: 120,
      note: 'Bus ticket',
      bill: 'https://via.placeholder.com/150'
    },
    {
      date: '2026-04-03',
      category: 'Groceries',
      amount: 850,
      note: 'Weekly shopping',
      bill: 'https://via.placeholder.com/150'
    },
    {
      date: '2026-04-04',
      category: 'Electricity',
      amount: 1500,
      note: 'EB Bill',
      bill: 'https://via.placeholder.com/150'
    },
    {
      date: '2026-04-05',
      category: 'Entertainment',
      amount: 300,
      note: 'Movie',
      bill: 'https://via.placeholder.com/150'
    }
  ];

  // send edit event to dashboard
  @Output() edit = new EventEmitter<any>();
  editData: any;

  onEdit(expense: any) {
    this.editData=expense;
    this.openForm = true;
    console.log(expense,'---------------> expense');
    // this.edit.emit(expense);
  }
  closeForm() {
    this.openForm = false
  }
}