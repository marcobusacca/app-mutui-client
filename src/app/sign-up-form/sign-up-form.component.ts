import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  @ViewChild('signUpForm') signUpForm: NgForm;
  isLoading = false;
  errorMessage = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.signUpForm);
  }
}
