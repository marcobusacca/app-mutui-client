import { Prodotto } from "./prodotto.model";
import { LoggedUserForm } from "./logged-user-form.model";

export class LoggedUserFormData {
    constructor(
        private prodottoSelezionato: Prodotto,
        private loggedUserForm: LoggedUserForm
    ) { }
}