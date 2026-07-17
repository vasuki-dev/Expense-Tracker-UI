import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from '../../service/expense_service';
import { ExpenseForm } from '../expense-form/expense-form';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';
import { ExpenseList } from '../expense-list/expense-list';

@Component({
  selector: 'app-dashboard',
  imports: [ExpenseForm, FormsModule, CommonModule, BaseChartDirective,ExpenseList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  selectedMonth = signal(new Date().getMonth() + 1);
  expenseService = inject(ExpenseService);
  expenses = this.expenseService.expense;
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#14b8a6',
          '#06b6d4',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#22c55e',
          '#3b82f6'
        ]
      }
    ]
  };
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Monthly Expense',
        data: [],
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20,184,166,0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
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
  selectedYear = new Date().getFullYear();

  years: number[] = [];

  selectedMonthYear = signal(this.getCurrentMonth());

  maxMonth = this.getCurrentMonth();

  constructor(private router: Router, private toast: ToastrService) {
    effect(() => {
      const expense = this.expenseService.expense();
      if (expense.length > 0) {
        this.generateYears();
        this.loadCategoryChart();
        this.loadMonthlyChart();
      }
    })
  }
  ngOnInit(): void {
    this.userdetails = JSON.parse(localStorage.getItem('userdetails') || '{}');
    let data = {
      userCode: this.userdetails?.userCode
    }
    this.expenseService.expenseList(data);
  }
  getCurrentMonth(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }
  generateYears() {

    const yearSet = new Set<number>();

    this.expenses().forEach(exp => {

      yearSet.add(new Date(exp.date).getFullYear());

    });

    this.years = [...yearSet].sort((a, b) => b - a);

    if (!this.selectedYear && this.years.length) {

      this.selectedYear = this.years[0];

    }

  }
  
  loadMonthlyChart() {
    console.log('joo', this.selectedYear)
    const year = Number(this.selectedYear);
    const monthTotals = new Array(12).fill(0);
    this.expenses().forEach(exp => {

      const date = new Date(exp.date);

      if (date.getFullYear() === year) {

        monthTotals[date.getMonth()] += exp.amount;

      }

    });
    console.log(monthTotals);
    console.log(this.lineChartData);

    this.lineChartData = {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [{
        label: `${this.selectedYear} Expense`,
        data: monthTotals,
        borderColor: '#0f766e',
        backgroundColor: 'rgba(20,184,166,.2)',
        tension: .4,
        fill: true
      }]
    };

  }
  loadCategoryChart() {

    const categoryMap: Record<string, number> = {};

    this.expenses().forEach(exp => {

      categoryMap[exp.category] =
        (categoryMap[exp.category] || 0) + exp.amount;

    });

    const labels = Object.keys(categoryMap);

    const values = Object.values(categoryMap);

    this.pieChartData = {

      labels,

      datasets: [{

        data: values,

        backgroundColor: this.generateColors(labels.length),

        borderWidth: 2,

        borderColor: '#ffffff'

      }]

    };

  }
  monthChange(event: Event) {

    const value = (event.target as HTMLInputElement).value;

    this.selectedMonthYear.set(value);

  }
  generateColors(count: number): string[] {

    const colors: string[] = [];

    for (let i = 0; i < count; i++) {

      const hue = Math.round((360 / count) * i);

      colors.push(`hsl(${hue}, 75%, 55%)`);

    }

    return colors;

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
