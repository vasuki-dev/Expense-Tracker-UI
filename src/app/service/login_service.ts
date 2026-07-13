import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class loginService {
    private apiUrl = `${environment.apiUrl}/api`; // change your backend URL

    constructor(private http: HttpClient) { }

    login(data: { userName: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, data);
    }
    refreshToken(refreshToken: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/refreshtoken`, refreshToken);
    }

}