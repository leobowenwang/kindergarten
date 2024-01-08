import {
  ChangeDetectorRef,
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
import { Kindergarden } from 'src/app/shared/interfaces/Kindergarden';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() currentPage: number = 1;
  @Output() selectPageEvent = new EventEmitter<number>();
  @Output() operationSuccess = new EventEmitter<{
    message: string;
    type: string;
  }>();

  displayedColumns: string[] = [
    'name',
    'kindergarten',
    'address',
    'age',
    'birthdate',
    'enrollmentDate',
    'actions',
  ];

  selectedKindergartenId?: number;
  selectedSortOrder?: string;
  kindergartens: Kindergarden[] = [];

  constructor(
    public storeService: StoreService,
    private backendService: BackendService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.backendService.getKindergardens().subscribe((data) => {
      this.kindergartens = data;
    });
  }

  ngAfterViewInit(): void {
    this.fetchChildrenData();
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
    this.backendService.getChildren(
      this.currentPage,
      event.pageSize,
      this.selectedKindergartenId,
      this.selectedSortOrder
    );
  }

  public cancelRegistration(childId: string): void {
    if (this.paginator) {
      this.backendService
        .deleteChildData(childId, this.currentPage, this.paginator.pageSize)
        .subscribe(() => {
          this.operationSuccess.emit({
            message: 'Kind erfolgreich abgemeldet!',
            type: 'abgemeldet',
          });
        });
    }
  }

  onKindergartenChange(): void {
    this.resetPaginator();
    this.fetchChildrenData();
  }

  onSortChange(): void {
    this.resetPaginator();
    this.fetchChildrenData();
  }

  private resetPaginator(): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.currentPage = 1;
      this.changeDetectorRef.detectChanges();
    }
  }

  private fetchChildrenData(): void {
    if (this.paginator) {
      this.backendService.getChildren(
        this.currentPage,
        this.paginator.pageSize,
        this.selectedKindergartenId,
        this.selectedSortOrder
      );
    }
  }
}
