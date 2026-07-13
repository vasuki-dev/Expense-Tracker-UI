import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { ExpenseForm } from '../expense-form/expense-form';
import { ExpenseService } from '../../service/expense_service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, ExpenseForm, FormsModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss',
  providers: [DatePipe]
})
export class ExpenseList implements OnInit {
  filteredExpenses!: any[];
  selectedExpense: any;
  constructor(private expeneService: ExpenseService, private toast: ToastrService, private cdr: ChangeDetectorRef) { }
  // receive expenses from dashboard
  expenseService = inject(ExpenseService);
  expenses = this.expenseService.expense || [];
  userdetails: any;
  showDeleteDialog = false;
  openForm!: boolean;
  categories: any;
  searchTerm: any;
  selectedCategory: any;
  // send edit event to dashboard
  @Output() edit = new EventEmitter<any>();
  editData: any;
  ngOnInit(): void {
    this.userdetails = JSON.parse(localStorage.getItem('userdetails') || '{}');
    console.log(this.userdetails, '------------> user details');
    let data = {
      userCode: this.userdetails?.userCode
    }
    this.expeneService.expenseList(data);
  }
  applyFilters() {

    const search = this.searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      this.filteredExpenses = this.expenses();
      return;
    }


    this.filteredExpenses = this.expenses().filter(expense => {

      return (
        expense.note
          ?.toLowerCase()
          .includes(search) ||

        expense.category
          ?.toLowerCase()
          .includes(search) ||

        expense.amount
          .toString()
          .includes(search)
      );

    });

  }
  openAddForm() {
    this.openForm = true;
  }
  onDelete(expense: any) {
    this.selectedExpense = expense;
    this.showDeleteDialog = true;

  }
  cancelDelete() {

    this.showDeleteDialog = false;

    this.selectedExpense = null;

  }
  confirmDelete() {

    const payload = {
      _id: this.selectedExpense._id
    };

    this.expeneService.deleteExpense(payload).subscribe({

      next: (res: any) => {

        this.showDeleteDialog = false;

        this.selectedExpense = null;
        this.toast.success(res?.message || 'Expense deleted successfully');
        this.closeForm();
        this.reloadExpenseList();

      }

    });

  }
  onEdit(expense: any) {
    this.editData = expense;
    this.openForm = true;
    console.log(expense, '---------------> expense');
    // this.edit.emit(expense);
  }
  closeForm() {
    this.openForm = false;
    this.editData = null;
  }
  reloadExpenseList() {
    let data = {
      userCode: this.userdetails?.userCode
    }
    this.expeneService.expenseList(data, true);
  }
}