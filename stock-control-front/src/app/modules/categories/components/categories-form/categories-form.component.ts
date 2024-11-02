import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { CategoryEvent } from 'src/app/core/enums/categoryEvents.enum';
import { NotificationType } from 'src/app/core/enums/notificationType.enum';

import { EditCategoryAction } from 'src/app/models/interfaces/categories/events/EditCategoryAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryAction!: { event: EditCategoryAction };
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    public ref: DynamicDialogConfig,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService) {}

  ngOnInit(): void {

  }

  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      const requestCreateCategory: { name: string } = {
        name: this.categoryForm.value.name as string,
      };

      this.categoriesService.createCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset();
              this.notificationService.showNotificationMessage('Sucesso', 'Categoria registrada com sucesso', NotificationType.SUCCESS);
            }
          },
          error: (err) => {
            this.categoryForm.reset();
            this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar registrar a categoria', NotificationType.ERROR);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
