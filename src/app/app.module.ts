import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoaderComponent } from './loader/loader.component';
import { UserProductsComponent } from './user-products/user-products.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserResultComponent } from './user-result/user-result.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserDataComponent } from './user-data/user-data.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { AuthInterceptorService } from './service/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoaderComponent,
    SignUpFormComponent,
    LoginFormComponent,
    UserDataComponent,
    UserProductsComponent,
    UserFormComponent,
    UserResultComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
