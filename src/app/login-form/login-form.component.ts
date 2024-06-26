import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.loginForm.value['email'];
    const password = this.loginForm.value['password'];

    this.authService.login(
      email,
      password
    ).subscribe(
      responseData => {
        if (!responseData.esito) {
          this.errorMessage = responseData.messaggio;
          this.isLoading = false;
        } else {
          this.router.navigate(['/']);
        }
      },
      error => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    );
  }
}
