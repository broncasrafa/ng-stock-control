import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { NotificationType } from 'src/app/core/enums/notificationType.enum';
import { ProductEvent } from 'src/app/core/enums/productEvents.enum';
import { EventAction } from 'src/app/models/interfaces/EventAction';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public categoriesDatas: Array<GetCategoriesResponse> = [];

  public selectedCategory: Array<{ name: string; code: string }> = [];

  public productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };

  public productSelectedDatas!: GetAllProductsResponse;
  public productsDatas: Array<GetAllProductsResponse> = [];

  public saleProductSelected!: GetAllProductsResponse;
  public renderDropdown = false;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required]
  });

  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required]
  })

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;

    this.productAction?.event?.action === this.saleProductAction && this.getProductDatas();

    this.getAllCategories();
    this.renderDropdown = true;
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetCategoriesResponse[]) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
            if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productDatas) {
              this.getProductSelectedDatas(this.productAction?.event?.id as string);
            }
          }
        },
        error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar obter as categorias', NotificationType.ERROR)
      })
  }

  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productDatas;

    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter((element) => element?.id === productId);

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
          category_id: this.productSelectedDatas?.category?.id,
        });
      }
    }
  }

  getProductDatas(): void {
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas && this.productsDataTransferService.setProductsDatas(this.productsDatas);
          }
        },
        error: (err) => this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar obter os produtos', NotificationType.ERROR)
      });
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

  handleSubmitEditProduct(): void {
    if (this.editProductForm.value &&
        this.editProductForm.valid &&
        this.productAction.event.id) {

          const request: EditProductRequest = {
            name: this.editProductForm.value.name as string,
            price: this.editProductForm.value.price as string,
            description: this.editProductForm.value.description as string,
            product_id: this.productAction?.event?.id,
            amount: this.editProductForm.value.amount as number,
            category_id: this.editProductForm.value.category_id as string
          };

      this.productsService.editProduct(request)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.notificationService.showNotificationMessage('Sucesso', 'Produto atualizado com sucesso', NotificationType.SUCCESS);
              this.editProductForm.reset();
            },
            error: (err) => {
              this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar editar os dados do produto', NotificationType.ERROR)
              this.editProductForm.reset();
            }
          });
    }
  }

  handleSubmitSaleProduct(): void {
    if (this.saleProductForm?.value && this.saleProductForm?.valid) {
      const request: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number,
        product_id: this.saleProductForm.value?.product_id as string,
      };

      this.productsService.saleProduct(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.notificationService.showNotificationMessage('Sucesso', 'Venda efetuada com sucesso', NotificationType.SUCCESS);
              this.saleProductForm.reset();
              this.getProductDatas();
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            this.saleProductForm.reset();
            this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar efetuar a venda do produto', NotificationType.ERROR);
          },
        });
    }
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
