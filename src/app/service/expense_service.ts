import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

    expenses = signal<any[]>([
        {
            id: 1,
            date: '2026-04-26',
            category: 'Purchase',
            amount: 500,
            note: 'Rice',
            bill: 'bill1.png'
        }
    ])

    getMonthExpenses(month: string) {

        return this.expenses().filter((e: any) => `${new Date(e.date).getMonth() + 1}` == month)

    }

    addExpense(data: any) {
        this.expenses.update(list => [...list, data])
    }

    updateExpense(id: number, data: any) {

        this.expenses.update(list =>
            list.map(e => e.id == id ? data : e)
        )

    }

}