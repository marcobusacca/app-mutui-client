import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { LoggedUserAuthData } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const jwtToken = this.getJwtToken();
        if (jwtToken) {
            const modifiedRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken}`,
                }
            })
            return next.handle(modifiedRequest);
        } else {
            return next.handle(req);
        }
    }

    getJwtToken(): string | null {
        const userData: LoggedUserAuthData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            return userData.token;
        }
        return null;
    }
}