import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { ProductEvent } from 'src/app/core/enums/productEvents.enum';
import { ProductsFormComponent } from 'src/app/modules/products/components/products-form/products-form.component';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent {

  constructor(
    private router: Router,
    private cookie: CookieService,
    private dialogService: DialogService) {}

  handleLogout() {
    this.cookie.delete(AppConstants.COOKIE_USER_INFO);
    void this.router.navigate(['/home']);
  }

  handleSaleProduct(): void {
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

    this.dialogService.open(ProductsFormComponent, {
      header: saleProductAction,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: saleProductAction },
      },
    });
  }
}
