import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConstants } from 'src/app/core/constants/app.constants';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent {

  constructor(private cookie: CookieService, private router: Router) {}

  handleLogout() {
    this.cookie.delete(AppConstants.COOKIE_USER_INFO);
    void this.router.navigate(['/home']);
  }
}
