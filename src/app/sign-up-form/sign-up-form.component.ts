import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../model/user.model';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  @ViewChild('signUpForm') signUpForm: NgForm;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }

    const nome = this.signUpForm.value['nome'];
    const cognome = this.signUpForm.value['cognome'];
    const email = this.signUpForm.value['email'];
    const password = this.signUpForm.value['password'];
    const dataDiNascita = this.signUpForm.value['dataDiNascita'];

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signup(
      nome,
      cognome,
      email,
      password,
      dataDiNascita
    ).subscribe(
      responseData => {
        console.log(responseData);
        if (!responseData.esito) {
          this.errorMessage = responseData.messaggio;
          this.isLoading = false;
        } else {
          this.router.navigate(['/']);
        }
      },
      error => {
        this.errorMessage = error;
      }
    );
  }
}
