import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() currentPage: number = 1;
  @Input() currentPageSize: number = 2;
  @Output() selectPageEvent = new EventEmitter<number>();
  showNotification = false;

  displayedColumns: string[] = [
    'name',
    'kindergarten',
    'address',
    'age',
    'birthdate',
    'actions',
  ];

  constructor(
    public storeService: StoreService,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage, this.currentPageSize);
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
      age--;
    }
    return age;
  }

  selectPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.currentPageSize = event.pageSize;
    this.backendService.getChildren(this.currentPage, this.currentPageSize);
  }

  public cancelRegistration(childId: string) {
    this.backendService
      .deleteChildData(childId, this.currentPage, this.currentPageSize)
      .subscribe(() => {
        this.showNotification = true;
        setTimeout(() => (this.showNotification = false), 3000);
      });
  }
}
