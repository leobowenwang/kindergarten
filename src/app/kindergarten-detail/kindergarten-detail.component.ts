import { Component, OnInit } from '@angular/core';
import { Kindergarden } from '../shared/interfaces/Kindergarden';
import { BackendService } from '../shared/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-kindergarten-detail',
  templateUrl: './kindergarten-detail.component.html',
  styleUrls: ['./kindergarten-detail.component.scss'],
})
export class KindergartenDetailComponent implements OnInit {
  kindergarten: Kindergarden | null = null;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.backendService
          .getKindergartenById(+id)
          .subscribe((kg) => (this.kindergarten = kg));
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
