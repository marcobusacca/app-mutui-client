export class User {
    constructor(
        private nome: string,
        private cognome: string,
        private email: string,
        private password: string,
        private dataDiNascita: Date,
    ) { }
}