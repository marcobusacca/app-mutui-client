import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoggedUserService } from '../service/logged-user.service';
import { LoggedUser } from '../model/logged-user.model';
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

  constructor(private loggedUserService: LoggedUserService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    // AVVIO IL LOADING
    this.isLoading = true;

    // CREO L'ISTANZA DELL'UTENTE ATTUALMENTE LOGGATO
    const loggedUserEta = this.loginForm.value.eta;
    const loggedUserIsCliente = this.loginForm.value.cliente;
    this.loggedUserService.loggedUser = new LoggedUser(loggedUserEta, loggedUserIsCliente);

    // AVVIO LA CHIAMATA API ED OTTENGO LA RISPOSTA
    this.loggedUserService.getLoggedUserProducts().subscribe(
      (response) => {
        if (!response.esito) {
          this.errorMessage = response.messaggio;
          this.isLoading = false;
        } else {
          this.loggedUserService.loggedUserProducts = response.response;
          this.router.navigate(['/user/products']);
        }
      },
      (error) => {
        console.error('Errore nella chiamata API getLoggedUserProducts:', error);
        this.errorMessage = 'Errore di connessione. Riprovare più tardi.';
        this.isLoading = false;
      }
    );
  }
}
