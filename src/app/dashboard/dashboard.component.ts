import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public currentPage: number = 1;
  public showAddData = true;
  isRegistered = false;
  showNotification = false;
  notificationMessage = '';

  receiveMessage(newPageCount: number) {
    this.currentPage = newPageCount;
  }

  toggleButtonClicked(showAddData: boolean) {
    this.showAddData = showAddData;
  }

  showNotificationMessage(notificationData: { message: string; type: string }) {
    this.notificationMessage = notificationData.message;
    this.isRegistered = notificationData.type === 'registered';
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }
}
