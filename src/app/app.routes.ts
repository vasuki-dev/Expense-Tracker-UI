import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./components/login/login').then(com => com.Login) },
    { path: 'signup', loadComponent: () => import('./components/signup/signup').then(com => com.Signup) },
    {
        path: 'layout', loadComponent: () => import('./components/topbar/topbar').then(com => com.Topbar),
        children: [
            { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(com => com.Dashboard) },
            {
                path: 'expense-view', loadComponent: () => import('./components/expense-list/expense-list').then(com => com.ExpenseList)
            }
        ]
    }
];
