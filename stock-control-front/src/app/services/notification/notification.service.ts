import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NotificationType } from 'src/app/core/enums/notificationType.enum';

type NotificationTypeValids = 'success' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  /**
   * Exibir o toast da mensagem de notificação
   * @param title - o titulo da notificação
   * @param message  - o mensagem da notificação
   * @param notificationType  - o tipo de notificação. (success, info, warn, error)
   * @param duration  - a duração em milisegundos da notificação. Por padrão é 2000 ms
   */
  showNotificationMessage(title: string, message: string, notificationType: string, duration: number = 3000) {
    if (!this.isValidNotificationType(notificationType))
      throw new Error('Tipo de notificação inválida');

    this.messageService.add({
      severity: notificationType,
      summary: title,
      detail: message,
      life: duration
    });
  }


  // Função para validar se a string é um valor válido no enum NotificationType
  private isValidNotificationType(type: string): type is NotificationTypeValids {
    return Object.values(NotificationType).includes(type as NotificationType);
  }
}
