import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CategoriesFormComponent } from './../../components/categories-form/categories-form.component';

import { NotificationType } from 'src/app/core/enums/notificationType.enum';

import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/events/DeleteCategoryAction';

import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { EventAction } from 'src/app/models/interfaces/EventAction';



@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.scss']
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;

  public categoriesDatas: Array<GetCategoriesResponse> = [];

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }


  getAllCategories() {
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar obter as categorias', NotificationType.ERROR);
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleDeleteCategoryAction(event: DeleteCategoryAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão da categoria: ${event?.categoryName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCategory(event?.category_id),
      });
    }
  }

  deleteCategory(category_id: string): void {
    if (category_id) {
      this.categoriesService.deleteCategory({ category_id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAllCategories();
            this.notificationService.showNotificationMessage('Sucesso', 'Categoria removida com sucesso', NotificationType.SUCCESS);
          },
          error: (err) => {
            this.getAllCategories();
            this.notificationService.showNotificationMessage('Erro', 'Ocorreu um erro ao tentar remover a categoria', NotificationType.ERROR);
          },
        });
    }
  }


  handleCategoryAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(CategoriesFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
        },
      });

      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAllCategories(),
      });
    }
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}
