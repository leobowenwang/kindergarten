import { Component, OnInit } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { Kindergarden } from '../shared/interfaces/Kindergarden';

@Component({
  selector: 'app-kindergarten-list',
  templateUrl: './kindergarten-list.component.html',
  styleUrls: ['./kindergarten-list.component.scss']
})
export class KindergartenListComponent implements OnInit {
  kindergardens: Kindergarden[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getKindergardens().subscribe((data: Kindergarden[]) => {
      this.kindergardens = data;
    });

  }
}
