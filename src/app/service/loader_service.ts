import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class loaderService {
loading = signal(false);
}