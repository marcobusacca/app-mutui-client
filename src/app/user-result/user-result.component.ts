import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserData } from '../model/user-data.model';
import { Prodotto } from '../model/prodotto.model';
import { LoggedUserForm } from '../model/logged-user-form.model';

@Component({
  selector: 'app-user-result',
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.css']
})
export class UserResultComponent implements OnInit {
  userData: UserData;
  selectedProduct: Prodotto;
  campiInput: string[];
  loggedUserForm: LoggedUserForm;
  finalResult: { [key: string]: number };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userData = this.userService.userData;
    this.selectedProduct = this.userService.selectedProduct;
    this.campiInput = this.userService.campiInput;
    this.loggedUserForm = this.userService.loggedUserForm;
    this.finalResult = this.userService.finalResult;
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
