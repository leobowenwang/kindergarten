import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';
import { CHILDREN_PER_PAGE } from './constants';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient, private storeService: StoreService) {}

  public getKindergardens() {
    this.http
      .get<Kindergarden[]>('http://localhost:5000/kindergardens')
      .subscribe((data) => {
        this.storeService.kindergardens = data;
      });
  }

  public getChildren(page: number, pageSize: number) {
    this.http
      .get<ChildResponse[]>(
        `http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${pageSize}`,
        { observe: 'response' }
      )
      .subscribe((data) => {
        this.storeService.children = data.body!;
        this.storeService.childrenTotalCount = Number(
          data.headers.get('X-Total-Count')
        );
        this.storeService.isLoading = false;
      });
  }

  public addChildData(
    child: Child,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http
      .post('http://localhost:5000/childs', child)
      .pipe(tap(() => this.getChildren(page, pageSize)));
  }

  public deleteChildData(
    childId: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http
      .delete(`http://localhost:5000/childs/${childId}`)
      .pipe(tap(() => this.getChildren(page, pageSize)));
  }
}
