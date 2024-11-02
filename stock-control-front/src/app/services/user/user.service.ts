import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/auth/AuthResponse';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url = environment.API_URL;

  constructor(private http: HttpClient, private cookie: CookieService) { }


  authUser(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.api_url + '/auth', request);
  }

  signupUser(request: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(this.api_url + '/user', request);
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }
}
