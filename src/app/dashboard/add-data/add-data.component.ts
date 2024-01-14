import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';

import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Output } from '@angular/core';
import { Kindergarden } from 'src/app/shared/interfaces/Kindergarden';

function dateRangeValidator(minDate: Date, maxDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const date = new Date(control.value);
    if (date < minDate || date > maxDate) {
      return { dateRange: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss'],
})
export class AddDataComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder,
    public storeService: StoreService,
    public backendService: BackendService
  ) {}
  public addChildForm: any;
  @Input() currentPage!: number;
  @Input() currentPageSize!: number;
  @Output() operationSuccess = new EventEmitter<{
    message: string;
    type: string;
  }>();
  kindergardens: Kindergarden[] = [];

  ngOnInit(): void {
    const minDate = new Date('2018-01-01');
    const today = new Date();

    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      kindergardenId: ['', Validators.required],
      birthDate: [
        '',
        [Validators.required, dateRangeValidator(minDate, today)],
      ],
    });

    this.backendService.getKindergardens().subscribe((data) => {
      this.kindergardens = data;
    });
  }

  onSubmit() {
    if (this.addChildForm.valid) {
      console.log(this.currentPage);
      this.backendService
        .addChildData(
          this.addChildForm.value,
          this.currentPage,
          this.currentPageSize
        )
        .subscribe(() => {
          this.operationSuccess.emit({
            message: 'Kind erfolgreich registriert!',
            type: 'registered',
          });
        });
    }
  }
}
