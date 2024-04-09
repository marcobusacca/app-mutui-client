import { Component, OnInit, ViewChild } from '@angular/core';
import { LoggedUserService } from '../service/logged-user.service';
import { NgForm } from '@angular/forms';
import { LoggedUser } from '../model/logged-user.model';
import { Prodotto } from '../model/prodotto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css']
})
export class UserProductsComponent implements OnInit {
  @ViewChild('userProductsForm') userProductsForm: NgForm;
  isLoading = false;
  errorMessage = '';

  loggedUser: LoggedUser;
  loggedUserProducts: Prodotto[];

  constructor(private loggedUserService: LoggedUserService, private router: Router) { }

  ngOnInit() {
    this.loggedUser = this.loggedUserService.loggedUser;
    this.loggedUserProducts = this.loggedUserService.loggedUserProducts;
  }

  onSubmit() {
    // AVVIO IL LOADING
    this.isLoading = true;

    // CREO L'ISTANZA DEL PRODOTTO SCELTO DALL'UTENTE
    this.loggedUserService.selectedProduct = this.userProductsForm.value.prodotto;

    // AVVIO LA CHIAMATA API ED OTTENGO LA RISPOSTA
    this.loggedUserService.getLoggedUserForm().subscribe(
      (response) => {
        if (!response.esito) {
          this.errorMessage = response.messaggio;
          this.isLoading = false;
        } else {
          this.loggedUserService.campiInput = response.response;
          this.router.navigate(['/user/form']);
        }
      },
      (error) => {
        console.error('Errore nella chiamata API getLoggedUserForm:', error);
        this.errorMessage = 'Errore di connessione. Riprovare più tardi.';
        this.isLoading = false;
      }
    );
  }
}
