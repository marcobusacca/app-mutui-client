import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    if (route.routeConfig.path === 'user/data' || route.routeConfig.path === 'user/profile') {
      return this.authService.user.pipe(
        take(1),
        map(user => {
          if (user) {
            return true;
          }
          return this.router.createUrlTree(['/login']);
        })
      );
    }
    if (route.routeConfig.path === 'sign-up' || route.routeConfig.path === 'login') {
      return this.authService.user.pipe(
        take(1),
        map(user => {
          if (!user) {
            return true;
          }
          return this.router.createUrlTree(['/']);
        })
      );
    }
    if (route.routeConfig.path !== 'sign-up' && route.routeConfig.path !== 'login' && route.routeConfig.path !== 'user-data') {
      return this.authService.user.pipe(
        take(1),
        map(user => {
          if (user) {
            if (this.userService.userData !== undefined) {
              return true;
            } else {
              return this.router.createUrlTree(['/']);
            }
          }
          return this.router.createUrlTree(['/login']);
        })
      );
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
