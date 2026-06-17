import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from '../../service/expense_service';
import { ExpenseForm } from '../expense-form/expense-form';
import { ExpenseList } from '../expense-list/expense-list';


@Component({
  selector: 'app-dashboard',
  imports: [ExpenseForm],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  expenses: any[] = []
  selectedMonth = ''

  showList = false
  openForm = false
  editData: any = null

  constructor(private router: Router, private service: ExpenseService) { }

  monthChange(e: any) {

    this.selectedMonth = e.target.value
    this.expenses = this.service.getMonthExpenses(this.selectedMonth)

  }

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
