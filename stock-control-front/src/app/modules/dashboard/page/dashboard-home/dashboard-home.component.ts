
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
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
  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

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
                this.setProductsChartConfig();
              }
          },
          error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar obter os produtos', NotificationType.ERROR, 3000)
        })
    }


    setProductsChartConfig(): void {
      if (this.productsList.length > 0) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.productsChartDatas = {
          labels: this.productsList.map((product) => product?.name),
          datasets: [
            {
              label: 'Quantidade',
              data: this.productsList.map((product) => product?.amount),
              backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
              borderColor: documentStyle.getPropertyValue('--indigo-400'),
              hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
            }
          ],
        }

        this.productsChartOptions = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },

          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: '500',
                },
              },
              grid: {
                color: surfaceBorder,
              },
            },
            y: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
              },
            },
          },
        };
      }
    }


    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
