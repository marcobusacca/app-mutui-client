import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";

import { UserData } from "../model/user-data.model";
import { Prodotto } from "../model/prodotto.model";
import { LoggedUserForm } from "../model/logged-user-form.model";
import { LoggedUserFormData } from "../model/logged-user-form-data.model";

@Injectable({ providedIn: 'root' })
export class UserService {

    private baseUrl: string;

    public userData: UserData;

    public loggedUserProducts: Prodotto[];
    public selectedProduct: Prodotto;

    public campiInput: string[];

    public loggedUserForm: LoggedUserForm;
    public loggedUserFormData: LoggedUserFormData;

    public finalResult: { [key: string]: number };

    constructor(private http: HttpClient) {
        if (isDevMode()) {
            this.baseUrl = 'http://127.0.0.1:8080/api';
        } else {
            this.baseUrl = '';
        }
    }

    getLoggedUserProducts() {
        return this.http
            .post<{ esito: boolean, messaggio: string, response: Prodotto[] }>(
                `${this.baseUrl}/logged-user-products`,
                this.userData
            )
    }

    getLoggedUserForm() {
        return this.http
            .post<{ esito: boolean, messaggio: string, response: string[] }>(
                `${this.baseUrl}/logged-user-form`,
                this.selectedProduct['codice']
            )
    }

    getLoggedUserFinalResult() {
        return this.http
            .post<{ esito: boolean, messaggio: string, response: { [key: string]: number } }>(
                `${this.baseUrl}/logged-user-final-result`,
                this.loggedUserFormData
            )
    }
}