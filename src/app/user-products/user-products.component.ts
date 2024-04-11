import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../service/user.service';
import { NgForm } from '@angular/forms';
import { UserData } from '../model/user-data.model';
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

  userData: UserData;
  loggedUserProducts: Prodotto[];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userData = this.userService.userData;
    this.loggedUserProducts = this.userService.loggedUserProducts;
  }

  onSubmit() {
    // AVVIO IL LOADING
    this.isLoading = true;

    // CREO L'ISTANZA DEL PRODOTTO SCELTO DALL'UTENTE
    this.userService.selectedProduct = this.userProductsForm.value.prodotto;

    // AVVIO LA CHIAMATA API ED OTTENGO LA RISPOSTA
    this.userService.getLoggedUserForm().subscribe(
      (response) => {
        if (!response.esito) {
          this.errorMessage = response.messaggio;
          this.isLoading = false;
        } else {
          this.userService.campiInput = response.response;
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
