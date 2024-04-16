import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";
import { User } from "../model/user.model";
import { BehaviorSubject, tap } from "rxjs";
import { Router } from "@angular/router";
import { UserImage } from "../model/user-image.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { UserAudio } from "../model/user-audio.model";

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

    constructor(private http: HttpClient, private router: Router, private domSanitizer: DomSanitizer) {
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
        const loggedUserImage: UserImage = new UserImage(
            this.getFileFromBytes(loggedUser['userImage']),
            this.getSafeUrlFromFile(this.getFileFromBytes(loggedUser['userImage']))
        );
        const loggedUserAudio: UserAudio = new UserAudio(
            this.getFileFromBytes(loggedUser['userAudio']),
            this.getSafeUrlFromFile(this.getFileFromBytes(loggedUser['userAudio']))
        );

        const loadedUser = new User(
            loggedUser['nome'],
            loggedUser['cognome'],
            loggedUser['email'],
            loggedUser['password'],
            loggedUser['dataDiNascita'],
            loggedUserImage,
            loggedUserAudio
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
            const loggedUserImage: UserImage = new UserImage(
                this.getFileFromBytes(user['userImage']),
                this.getSafeUrlFromFile(this.getFileFromBytes(user['userImage']))
            );
            const loggedUserAudio: UserAudio = new UserAudio(
                this.getFileFromBytes(user['userAudio']),
                this.getSafeUrlFromFile(this.getFileFromBytes(user['userAudio']))
            );

            const loggedUser = new User(
                user['nome'],
                user['cognome'],
                user['email'],
                user['password'],
                user['dataDiNascita'],
                loggedUserImage,
                loggedUserAudio
            );

            this.tokenExpirationDate = new Date(loggedUserAuthData.tokenExpiration);
            const expirationDuration = this.tokenExpirationDate.getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);

            this.user.next(loggedUser);
        }
    }

    private getFileFromBytes(bytes: any): File {

        const nome = bytes['nome'];
        const type = bytes['type'];
        const picByte = bytes['picByte'];

        // FROM BYTES TO BLOB
        const byteString = window.atob(picByte);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([int8Array], { type: type });
        // END FROM BYTES TO BLOB

        // FROM BLOB TO FILE
        return new File([blob], nome, { type: type });
    }

    private getSafeUrlFromFile(file: File): SafeUrl {
        // CREATING SAFE_URL FROM FILE
        return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    }
}