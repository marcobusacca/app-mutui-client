import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl: string;

    constructor(private http: HttpClient) {
        if (isDevMode()) {
            this.baseUrl = 'http://127.0.0.1:8080/api';
        } else {
            this.baseUrl = '';
        }
    }

    isAuthenticated() {
        const promise = new Promise(
            (resolve, reject) => {
                resolve(true);
            }
        );
        return promise;
    }
}