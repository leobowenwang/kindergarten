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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const pageSize = this.paginator.pageSize;
    this.backendService.getChildren(this.currentPage, pageSize);
  }

  getAge(birthDate: string): number {
    const today = new Date();
    const birthDateTimestamp = new Date(birthDate);
    let age = today.getFullYear() - birthDateTimestamp.getFullYear();
    const monthDiff = today.getMonth() - birthDateTimestamp.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateTimestamp.getDate())
    ) {
      age--;
    }
    return age;
  }

  selectPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.backendService.getChildren(this.currentPage, event.pageSize);
  }

  public cancelRegistration(childId: string): void {
    if (this.paginator) {
      this.backendService
        .deleteChildData(childId, this.currentPage, this.paginator.pageSize)
        .subscribe(() => {
          this.showNotification = true;
          setTimeout(() => (this.showNotification = false), 3000);
        });
    }
  }
}
