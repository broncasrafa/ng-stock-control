import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/app/core/enums/categoryEvents.enum';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/events/DeleteCategoryAction';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/events/EditCategoryAction';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent {
  @Input() public categories: Array<GetCategoriesResponse> = [];
  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>();
  @Output() public deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>();

  public categorySelected!: GetCategoriesResponse;
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;


  handleDeleteCategoryEvent(category_id: string, categoryName: string): void {
    if (category_id !== '' && categoryName !== '') {
      this.deleteCategoryEvent.emit({ category_id, categoryName });
    }
  }

  handleCategoryEvent(action: string, id?: string, categoryName?: string): void {
    if (action && action !== '') {
      this.categoryEvent.emit({ action, id, categoryName });
    }
  }
}
