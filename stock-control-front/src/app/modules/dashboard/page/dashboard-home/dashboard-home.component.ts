
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { NotificationService, NotificationType } from 'src/app/services/notification/notification.service';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private notificationService: NotificationService,
    private productsDataTransferService: ProductsDataTransferService) {}

    ngOnInit(): void {
      this.getProductsDatas();
    }

    getProductsDatas() {
      this.productsService.getAllProducts()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
              if (response && response.length > 0) {
                this.productsList = response;
                this.productsDataTransferService.setProductsDatas(this.productsList);
              }
          },
          error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar obter os produtos', NotificationType.ERROR, 3000)
        })
    }





    ngOnDestroy(): void {

    }
}
