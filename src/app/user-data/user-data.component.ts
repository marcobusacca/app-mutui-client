import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { UserData } from '../model/user-data.model';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  @ViewChild('loginForm') loginForm: NgForm;
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    // AVVIO IL LOADING
    this.isLoading = true;

    // CREO L'ISTANZA DELL'UTENTE ATTUALMENTE LOGGATO
    const loggedUserEta = this.loginForm.value.eta;
    const loggedUserIsCliente = this.loginForm.value.cliente;
    this.userService.userData = new UserData(loggedUserEta, loggedUserIsCliente);

    // AVVIO LA CHIAMATA API ED OTTENGO LA RISPOSTA
    this.userService.getLoggedUserProducts().subscribe(
      (response) => {
        if (!response.esito) {
          this.errorMessage = response.messaggio;
          this.isLoading = false;
        } else {
          this.userService.loggedUserProducts = response.response;
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
