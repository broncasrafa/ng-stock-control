import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(`${this.API_URL}/categories`);
  }
}
