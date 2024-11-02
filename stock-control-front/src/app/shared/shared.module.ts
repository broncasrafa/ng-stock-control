import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from "primeng/toast";
import { DialogService } from 'primeng/dynamicdialog';

import { NotificationMessageComponent } from './components/notification-message/notification-message.component';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';

@NgModule({
  declarations: [
    NotificationMessageComponent,
    ToolbarNavigationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //PrimeNg
    ToolbarModule,
    CardModule,
    ButtonModule,
    ToastModule
  ],
  exports: [
    NotificationMessageComponent,
    ToolbarNavigationComponent
  ],
  providers: [DialogService, CurrencyPipe],
})
export class SharedModule {}
