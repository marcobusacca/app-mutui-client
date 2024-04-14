import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";
import { User } from "../model/user.model";
import { BehaviorSubject, tap } from "rxjs";
import { Router } from "@angular/router";
import { UserImage } from "../model/user-image.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

export interface ResponseData {
    response: LoggedUserAuthData;
    esito: boolean;
    messaggio: string;
}

export interface LoggedUserAuthData {
    token: string;
    tokenExpiration: number;
    user: User,
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl: string;
    user = new BehaviorSubject<User>(null);
    tokenExpirationDate: Date;
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer) {
        if (isDevMode()) {
            this.baseUrl = 'http://127.0.0.1:8080/api';
        } else {
            this.baseUrl = '';
        }
    }

    signup(formData: FormData) {

        return this.http
            .post<ResponseData>(
                `${this.baseUrl}/sign-up`,
                formData
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
        const loggedUser: User = userData.user;
        const loggedUserImage: UserImage = this.getUserImageFromBytes(loggedUser['userImage']);

        const loadedUser = new User(
            loggedUser['nome'],
            loggedUser['cognome'],
            loggedUser['email'],
            loggedUser['password'],
            loggedUser['dataDiNascita'],
            loggedUserImage
        );
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

            const user: User = loggedUserAuthData.user;
            const loggedUserImage: UserImage = this.getUserImageFromBytes(user['userImage']);

            const loggedUser = new User(
                user['nome'],
                user['cognome'],
                user['email'],
                user['password'],
                user['dataDiNascita'],
                loggedUserImage
            );

            this.tokenExpirationDate = new Date(loggedUserAuthData.tokenExpiration);
            const expirationDuration = this.tokenExpirationDate.getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);

            this.user.next(loggedUser);
        }
    }

    private getUserImageFromBytes(userImageBytes: any): UserImage {

        const nome = userImageBytes['nome'];
        const picByte = userImageBytes['picByte'];
        const imageType = userImageBytes['type'];

        // FROM BYTES TO BLOB
        const byteString = window.atob(picByte);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([int8Array], { type: imageType });
        // END FROM BYTES TO BLOB

        // FROM BLOB TO FILE
        const file = new File([blob], nome, { type: imageType });

        // CREATING SAFE_URL FROM FILE
        const url: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));

        // CREATING USER_IMAGE
        const userImage: UserImage = new UserImage(file, url);

        return userImage;
    }
}