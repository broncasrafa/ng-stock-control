
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user/user.service';
import { AuthRequest } from 'src/app/models/interfaces/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/auth/AuthResponse';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

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
    private userService: UserService,
    private cookieService: CookieService) { }



  onLoginSubmit() {
    if (this.loginForm.value && this.loginForm.valid) {
      const data = this.loginForm.value as AuthRequest;
      this.userService.authUser(data)
        .subscribe({
          next: (response: AuthResponse) => {
            if (response) {
              alert(`Bem  vindo ${response.name}!`);
              this.cookieService.set('USER_INFO', response?.token);
              this.loginForm.reset();
              this.loginCard = true;
            }
          },
          error: (err) => console.log(err),
        })
    }
  }

  onSignupSubmit() {
    if (this.signupForm.value && this.signupForm.valid) {
      const data = this.signupForm.value as SignupUserRequest;
      this.userService.signupUser(data)
        .subscribe({
          next: (response: SignupUserResponse) => {
            if (response) {
              alert('Salvo com sucesso');
              this.signupForm.reset();
              this.loginCard = true;
            }
          },
          error: (err) => console.log(err),
        })
    }
  }




}
