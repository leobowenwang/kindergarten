import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Child, ChildResponse } from './interfaces/Child';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient, private storeService: StoreService) {}

  public getKindergardens(): Observable<Kindergarden[]> {
    return this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens');
  }

  public getChildren(
    page: number,
    pageSize: number,
    kindergartenId?: number,
    sortOrder?: string
  ): void {
    let query = `http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${pageSize}`;

    if (kindergartenId) {
      query += `&kindergardenId=${kindergartenId}`;
    }

    if (sortOrder) {
      const [sortField, order] = sortOrder.split('-');
      query += `&_sort=${sortField}&_order=${order}`;
    }

    console.log('API Query:', query);
    this.http
      .get<ChildResponse[]>(query, { observe: 'response' })
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
    this.storeService.isLoading = true;
    return this.http.post('http://localhost:5000/childs', child).pipe(
      tap(() => {
        this.getChildren(page, pageSize);
        this.storeService.isLoading = false;
      })
    );
  }

  public deleteChildData(
    childId: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    this.storeService.isLoading = true;
    return this.http.delete(`http://localhost:5000/childs/${childId}`).pipe(
      tap(() => {
        this.getChildren(page, pageSize);
        this.storeService.isLoading = false;
      })
    );
  }

  public getKindergartenById(id: number): Observable<Kindergarden> {
    return this.http.get<Kindergarden>(
      `http://localhost:5000/kindergardens/${id}`
    );
  }
}
