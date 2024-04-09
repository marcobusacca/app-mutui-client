import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Prodotto } from '../model/prodotto.model';
import { LoggedUserService } from '../service/logged-user.service';
import { Router } from '@angular/router';
import { LoggedUserForm } from '../model/logged-user-form.model';
import { LoggedUserFormData } from '../model/logged-user-form-data.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @ViewChild('userProductRequestForm') userProductRequestForm: NgForm;
  isLoading = false;
  errorMessage = '';

  selectedProduct: Prodotto;
  campiInput: string[];

  inputDurataForm = [];
  maxDurataForm = 30;
  classeEnergeticaForm = ["G", "F", "E", "D", "C", "B", "A1", "A2", "A3", "A4"];

  constructor(private loggedUserService: LoggedUserService, private router: Router) { }

  ngOnInit() {
    this.selectedProduct = this.loggedUserService.selectedProduct;
    this.campiInput = this.loggedUserService.campiInput;

    for (let i = 5; i <= this.maxDurataForm; i += 5) {
      this.inputDurataForm.push(i);
    }
  }

  onSubmit() {
    // AVVIO IL LOADING
    this.isLoading = true;

    // SALVO I DATI DEL FORM
    const formValue = this.userProductRequestForm.value;
    let importo = 0;
    let richiesto = 0;
    let durata = 0;
    let reddito = 0;
    let costoRistrutturazione = 0;
    let classeEnergetica = '';

    if (formValue['importo']) {
      importo = formValue['importo'];
    }
    if (formValue['richiesto']) {
      richiesto = formValue['richiesto'];
    }
    if (formValue['durata']) {
      durata = formValue['durata'];
    }
    if (formValue['reddito']) {
      reddito = formValue['reddito'];
    }
    if (formValue['costoRistrutturazione']) {
      costoRistrutturazione = formValue['costoRistrutturazione'];
    }
    if (formValue['classeEnergetica']) {
      classeEnergetica = formValue['classeEnergetica'];
    }

    // CREO L'ISTANZA DEL LOGGED_USER_FORM
    this.loggedUserService.loggedUserForm = new LoggedUserForm(importo, richiesto, durata, reddito, costoRistrutturazione, classeEnergetica);

    // CREO L'ISTANZA DEL LOGGED_USER_FORM_DATA
    this.loggedUserService.loggedUserFormData = new LoggedUserFormData(this.selectedProduct, this.loggedUserService.loggedUserForm);

    // AVVIO LA CHIAMATA API ED OTTENGO LA RISPOSTA
    this.loggedUserService.getLoggedUserFinalResult().subscribe(
      (response) => {
        if (!response.esito) {
          this.errorMessage = response.messaggio;
          this.isLoading = false;
        } else {
          this.loggedUserService.finalResult = response.response;
          this.router.navigate(['/user/result']);
        }
      },
      (error) => {
        console.error('Errore nella chiamata API getLoggedUserFinalResult:', error);
        this.errorMessage = 'Errore di connessione. Riprovare più tardi.';
        this.isLoading = false;
      }
    );
  }
}
