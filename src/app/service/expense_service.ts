import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
    private apiUrl = `${environment.apiUrl}/api`; // change your backend URL
    private readonly _expense = signal<any[]>([]);
    expense = this._expense.asReadonly();
    constructor(private http: HttpClient) { }

    expenseList(data: { userCode: number }, reload?: boolean) {
        if (this._expense().length > 0 && !reload) {
            return;
        }
        this.http.post(`${this.apiUrl}/expense/list`, data).subscribe({
            next: (res: any) => {
                this._expense.set(res?.response);
            }
        });
    }
    categoryList() {
        return this.http.get(`${this.apiUrl}/expense/categorylist`);
    }



    addExpense(data: any) {
        return this.http.post(`${this.apiUrl}/expense/add`, data);
    }

    updateExpense(data: any) {

        return this.http.post(`${this.apiUrl}/expense/update`, data);

    }
    deleteExpense(data: any) {

        return this.http.post(`${this.apiUrl}/expense/delete`, data);

    }

}