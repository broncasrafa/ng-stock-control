import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationType } from 'src/app/core/enums/notificationType.enum';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public categoriesDatas: Array<GetCategoriesResponse> = [];

  public selectedCategory: Array<{ name: string; code: string }> = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetCategoriesResponse[]) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
        error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar obter as categorias', NotificationType.ERROR)
      })
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const request = this.addProductForm.value as CreateProductRequest;

      this.productsService.createProduct(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.notificationService.showNotificationMessage('Sucesso', 'Produto registrado com sucesso', NotificationType.SUCCESS)
            }
          },
          error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar registrar o produto', NotificationType.ERROR)
        });
    }

    this.addProductForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
