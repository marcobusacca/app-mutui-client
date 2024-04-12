import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";
import { User } from "../model/user.model";
import { BehaviorSubject, tap } from "rxjs";
import { Router } from "@angular/router";

export interface LoggedUserAuthData {
    token: string;
    tokenExpiration: number;
    nome: string;
    cognome: string;
    email: string;
    password: string;
    dataDiNascita: Date;
}

export interface ResponseData {
    response: LoggedUserAuthData;
    esito: boolean;
    messaggio: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl: string;
    user = new BehaviorSubject<User>(null);
    tokenExpirationDate: Date;
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {
        if (isDevMode()) {
            this.baseUrl = 'http://127.0.0.1:8080/api';
        } else {
            this.baseUrl = '';
        }
    }

    signup(nome: string, cognome: string, email: string, password: string, dataDiNascita: Date) {

        return this.http
            .post<ResponseData>(
                `${this.baseUrl}/sign-up`,
                {
                    nome: nome,
                    cognome: cognome,
                    email: email,
                    password: password,
                    dataDiNascita: dataDiNascita
                }
            )
            .pipe(
                tap(responseData => {
                    this.handleAuthentication(responseData.response);
                })
            )
    }

    login(email: string, password: string) {
        return this.http
            .post<ResponseData>(
                `${this.baseUrl}/login`,
                {
                    email: email,
                    password: password
                }
            )
            .pipe(
                tap(responseData => {
                    this.handleAuthentication(responseData.response);
                })
            )
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationDate = null;
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        const userData: LoggedUserAuthData = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.nome, userData.cognome, userData.email, userData.password, userData.dataDiNascita);
        this.tokenExpirationDate = new Date(userData.tokenExpiration);
        const expirationDuration = this.tokenExpirationDate.getTime() - new Date().getTime();

        if (expirationDuration > 0) {
            this.user.next(loadedUser);
            this.autoLogout(expirationDuration);
        } else {
            this.logout();
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(loggedUserAuthData: LoggedUserAuthData) {
        if (Object.keys(loggedUserAuthData).length > 0) {
            localStorage.setItem('userData', JSON.stringify(loggedUserAuthData));
            const user = new User(
                loggedUserAuthData.nome,
                loggedUserAuthData.cognome,
                loggedUserAuthData.email,
                loggedUserAuthData.password,
                loggedUserAuthData.dataDiNascita
            );
            this.tokenExpirationDate = new Date(loggedUserAuthData.tokenExpiration);
            const expirationDuration = this.tokenExpirationDate.getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
            this.user.next(user);
        }
    }
}