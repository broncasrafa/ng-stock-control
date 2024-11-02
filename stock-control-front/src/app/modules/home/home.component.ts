
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationService, NotificationType } from 'src/app/services/notification/notification.service';

import { AuthRequest } from 'src/app/models/interfaces/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/auth/AuthResponse';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/core/constants/app.constants';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  loginCard: boolean = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    name: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    private notificationService: NotificationService) { }



  onLoginSubmit() {
    if (this.loginForm.value && this.loginForm.valid) {
      const data = this.loginForm.value as AuthRequest;
      this.userService.authUser(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: AuthResponse) => {
            if (response) {
              this.cookieService.set(AppConstants.COOKIE_USER_INFO, response?.token);
              this.loginForm.reset();
              this.router.navigate(['/dashboard']);
              this.notificationService.showNotificationMessage('Sucesso', `Bem vindo ${response.name}!`, NotificationType.SUCCESS);
            }
          },
          error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar realizar o login', NotificationType.ERROR),
        })
    }
  }

  onSignupSubmit() {
    if (this.signupForm.value && this.signupForm.valid) {
      const data = this.signupForm.value as SignupUserRequest;
      this.userService.signupUser(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: SignupUserResponse) => {
            if (response) {
              this.signupForm.reset();
              this.loginCard = true;
              this.notificationService.showNotificationMessage('Sucesso', `Usuário registrado com sucesso!`, NotificationType.SUCCESS);
            }
          },
          error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar realizar o cadastro', NotificationType.ERROR),
        })
    }
  }



  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}
