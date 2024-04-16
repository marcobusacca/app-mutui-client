import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { User } from '../model/user.model';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { UserImage } from '../model/user-image.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserAudio } from '../model/user-audio.model';
import RecordRTC from 'recordrtc';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  @ViewChild('signUpForm') signUpForm: NgForm;
  @ViewChild('userImageInput') userImageInput: NgModel;
  userImage: UserImage;
  userAudio: UserAudio;
  isLoading = false;
  isAuthorizingAudio = false;
  isRecording = false;
  audioStream: MediaStream;
  audioRecord: RecordRTC.StereoAudioRecorder;
  errorMessage = '';

  constructor(private domSanitizer: DomSanitizer, private authService: AuthService, private router: Router) { }

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

        const userImageUrl: SafeUrl = this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(userImageFile));
        this.userImage = new UserImage(userImageFile, userImageUrl);

      } else {
        this.userImageInput.reset();
        this.errorMessage = "Sono consentiti solo file di tipo jpeg, png, gif, bmp, webp, svg+xml, tiff, x-icon.";
      }
    }
  }

  onHandleRecording() {
    if (!this.isRecording) {
      this.isAuthorizingAudio = true;
      this.errorMessage = "";
      navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      }).then(
        (stream) => {
          this.isAuthorizingAudio = false;
          this.isRecording = true;
          this.audioStream = stream;
          this.audioRecord = new RecordRTC.StereoAudioRecorder(stream, {
            mimeType: 'audio/wav'
          })
          this.audioRecord.record();
        },
        () => {
          this.isAuthorizingAudio = false;
          this.isRecording = false;
          this.errorMessage = "Devi autorizzare l'accesso al tuo microfono per poter proseguire!";
        }
      );
    } else {
      this.isRecording = false;
      this.audioRecord.stop((blob: Blob) => {
        const userAudioFile = new File([blob], "audio.wav", { type: blob.type });
        const userAudioUrl: SafeUrl = this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(userAudioFile));
        this.userAudio = new UserAudio(userAudioFile, userAudioUrl);
      });
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => {
          track.stop();
        })
      }
    }
  }

  onSubmit() {
    if (this.signUpForm.invalid || !this.userAudio) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const nome = this.signUpForm.value['nome'];
    const cognome = this.signUpForm.value['cognome'];
    const email = this.signUpForm.value['email'];
    const password = this.signUpForm.value['password'];
    const dataDiNascita = this.signUpForm.value['dataDiNascita'];

    const newUser = new User(nome, cognome, email, password, dataDiNascita, this.userImage, this.userAudio);

    const formData = new FormData();
    formData.append(
      'user',
      new Blob([JSON.stringify(newUser)], { type: 'application/json' })
    );
    formData.append(
      'userImage',
      newUser['userImage']['file']
    );
    formData.append(
      'userAudio',
      newUser['userAudio']['file']
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
