import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../service/logged-user.service';
import { LoggedUser } from '../model/logged-user.model';
import { Prodotto } from '../model/prodotto.model';
import { LoggedUserForm } from '../model/logged-user-form.model';

@Component({
  selector: 'app-user-result',
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.css']
})
export class UserResultComponent implements OnInit {
  loggedUser: LoggedUser;
  selectedProduct: Prodotto;
  campiInput: string[];
  loggedUserForm: LoggedUserForm;
  finalResult: { [key: string]: number };

  constructor(private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.loggedUser = this.loggedUserService.loggedUser;
    this.selectedProduct = this.loggedUserService.selectedProduct;
    this.campiInput = this.loggedUserService.campiInput;
    this.loggedUserForm = this.loggedUserService.loggedUserForm;
    this.finalResult = this.loggedUserService.finalResult;
  }

  calcolaLtv() {
    let totaleImporto = this.loggedUserForm['importo'];
    let totaleRichiesto = this.loggedUserForm['richiesto'];

    if ('Ristrutturazione' === this.selectedProduct['descrizione']) {
      totaleRichiesto += this.loggedUserForm['costoRistrutturazione'];
    }

    return totaleRichiesto * 100 / totaleImporto;
  }
  rataMensileFormattata(rataMensile: number) {
    return rataMensile.toFixed(2);
  }
  calcolaRimborsoFinale(rataMensile: number, durata: number) {
    const mesi = durata * 12;
    return (rataMensile * mesi).toFixed(2);
  }
}
