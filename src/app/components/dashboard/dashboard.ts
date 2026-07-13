import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from '../../service/expense_service';
import { ExpenseForm } from '../expense-form/expense-form';
import { ExpenseList } from '../expense-list/expense-list';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [ExpenseForm, FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  selectedMonth = signal(new Date().getMonth() + 1);
  expenseService = inject(ExpenseService);
  expenses = this.expenseService.expense;
  showList = false
  openForm = false
  editData: any = null
  userdetails: any;
  months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];
  constructor(private router: Router, private toast: ToastrService) { }
  selectedMonthYear = signal(this.getCurrentMonth());

  maxMonth = this.getCurrentMonth();

  getCurrentMonth(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }

  monthChange(event: Event) {

    const value = (event.target as HTMLInputElement).value;

    this.selectedMonthYear.set(value);

  }
  ngOnInit(): void {
    this.userdetails = JSON.parse(localStorage.getItem('userdetails') || '{}');
    let data = {
      userCode: this.userdetails?.userCode
    }
    this.expenseService.expenseList(data);
  }
  monthExpenses = computed(() => {

    return this.expenses().filter(expense =>
      expense.date.startsWith(this.selectedMonthYear())
    );


  });
  monthTotal = computed(() => {

    return this.monthExpenses()
      .reduce((total, expense) => total + expense.amount, 0);

  });
  todayExpenses = computed(() => {

    const today = new Date();

    return this.expenses().filter(expense => {

      const date = new Date(expense.date);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );

    }).reduce((total, expense) => total + expense.amount, 0);;

  });

  viewExpenses() {
    // this.showList = true
    this.router.navigate(['/layout/expense-view']);
  }

  openAdd() {
    this.editData = null
    this.openForm = true
  }

  closeForm() {
    this.openForm = false
  }
  logout() {
    this.router.navigate(['/login']);
  }

}
