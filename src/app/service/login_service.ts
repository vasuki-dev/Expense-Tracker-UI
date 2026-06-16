import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class loginService {
    private apiUrl = 'http://localhost:3000/api'; // change your backend URL

    constructor(private http: HttpClient) { }

    login(data: { userName: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, data);
    }
}