import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./service/auth-guard.service";

import { LoginFormComponent } from "./login-form/login-form.component";
import { UserProductsComponent } from "./user-products/user-products.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { UserResultComponent } from "./user-result/user-result.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginFormComponent
    },
    {
        path: 'user/products',
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        component: UserProductsComponent
    },
    {
        path: 'user/form',
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        component: UserFormComponent
    },
    {
        path: 'user/result',
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        component: UserResultComponent
    },
    {
        path: 'not-found',
        component: NotFoundComponent,
        data: { message: 'Pagina non trovata!' },
    },
    {
        path: '**',
        redirectTo: 'not-found',
        pathMatch: 'full',
    },
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }