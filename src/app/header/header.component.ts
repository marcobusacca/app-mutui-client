import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../model/user.model';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  loggedUser: User;
  loggedUserImageUrl: SafeUrl;
  isAuthenticated = false;
  timer: number;
  private timerInterval: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated && this.authService.tokenExpirationDate > new Date()) {
        this.loggedUser = user;
        this.loggedUserImageUrl = user['userImage']['url'];
        console.log(this.loggedUserImageUrl);
        this.updateTimer();
        this.timerInterval = setInterval(() => {
          this.updateTimer();
        }, 1000);
      } else {
        clearInterval(this.timerInterval);
      }
    });
  }

  updateTimer() {
    this.timer = this.authService.tokenExpirationDate.getTime() - new Date().getTime();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
