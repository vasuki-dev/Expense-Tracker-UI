import { Injectable, signal } from "@angular/core";
import { single } from "rxjs";

@Injectable({ providedIn: 'root' })
export class loaderService {
    activeReq: number = 0;
    loading = signal(false);
    Show() {
        this.activeReq++;
        this.loading.set(true);
        console.log('-----------> loader show trigger', this.loading());
    }
    hide() {
        console.log('---------------> loader hide trigger');
        if (this.activeReq > 0) {
            this.activeReq--;
        }

        if (this.activeReq === 0) {
            this.loading.set(false);
        }
    }
}
