import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { NotificationType } from 'src/app/core/enums/notificationType.enum';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject<void>();

  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}



  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  getServiceProductsDatas() {
    const productsLoaded = this.productsDataTransferService.getProductsDatas();

    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else {
      this.getAPIProductsDatas();
    }
  }

  getAPIProductsDatas() {
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
          }
        },
        error: (err) => {
          this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar obter os produtos', NotificationType.ERROR, 3000);
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: EventAction): void {
    if (event) {
      console.log('DADOS DO EVENTO RECEBIDO', event);
    }
  }

  handleDeleteProductAction(event: DeleteProductAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto: ${event?.productName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id),
      });
    }
  }

  deleteProduct(product_id: string) {
    if (product_id) {
      this.productsService.deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.notificationService.showNotificationMessage('Sucesso', 'Produto removido com sucesso', NotificationType.SUCCESS, 3000);
              this.getAPIProductsDatas();
            }
          },
          error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar remover o produto', NotificationType.ERROR, 3000),
        });
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
