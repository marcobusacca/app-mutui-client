import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { User } from '../model/user.model';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { UserImage } from '../model/user-image.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  @ViewChild('signUpForm') signUpForm: NgForm;
  @ViewChild('userImageInput') userImageInput: NgModel;
  userImage: UserImage;
  isLoading = false;
  errorMessage = '';

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onFileSelected(event: Event) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      'image/tiff',
      'image/x-icon',
    ];

    if (event.target['files']) {

      this.errorMessage = "";
      const userImageFile: File = event.target['files'][0];

      if (allowedTypes.includes(userImageFile.type)) {

        const userImageUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(userImageFile));
        this.userImage = new UserImage(userImageFile, userImageUrl);

      } else {
        this.userImageInput.reset();
        this.errorMessage = "Sono consentiti solo file di tipo jpeg, png, gif, bmp, webp, svg+xml, tiff, x-icon.";
      }
    }
  }

  onRemoveUserImage() {
    this.userImage = null;
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const nome = this.signUpForm.value['nome'];
    const cognome = this.signUpForm.value['cognome'];
    const email = this.signUpForm.value['email'];
    const password = this.signUpForm.value['password'];
    const dataDiNascita = this.signUpForm.value['dataDiNascita'];

    const newUser = new User(nome, cognome, email, password, dataDiNascita, this.userImage);

    const formData = new FormData();
    formData.append(
      'user',
      new Blob([JSON.stringify(newUser)], { type: 'application/json' })
    );
    formData.append(
      'userImage',
      newUser['userImage']['file']
    );

    this.authService.signup(formData).subscribe(
      responseData => {
        if (!responseData.esito) {
          this.errorMessage = responseData.messaggio;
          this.isLoading = false;
        } else {
          this.router.navigate(['/']);
        }
      },
      error => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    );
  }
}
