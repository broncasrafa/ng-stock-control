import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/DeleteProductResponse';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { SaleProductResponse } from 'src/app/models/interfaces/products/response/SaleProductResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}


  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http.get<Array<GetAllProductsResponse>>(`${this.API_URL}/products`)
                      .pipe(map((product) => product.filter((data) => data?.amount > 0)));
  }

  deleteProduct(product_id: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(`${this.API_URL}/product/delete`,
      {
        params: {
          product_id: product_id,
        },
      }
    );
  }

  createProduct(request: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(`${this.API_URL}/product`, request);
  }

  editProduct(request: EditProductRequest): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/product/edit`, request);
  }

  saleProduct(request: SaleProductRequest): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(`${this.API_URL}/product/sale`,
      {
        amount: request?.amount,
      },
      {
        params: {
          product_id: request?.product_id,
        },
      }
    );
  }
}
