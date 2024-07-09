import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  
  private urlApi = 'https://api.unsplash.com';
  private accessKey = 'gnof3h7Xoxkw_ZN6GY0ErzH6BFoKCRe-choP-c8WR2g';
   constructor(private http: HttpClient) { }

  getRandomImages(count: number): Observable<string[]> {
    const url = `${this.urlApi}/photos/random?client_id=${this.accessKey}&count=${count}`;;
    return this.http.get<any[]>(url).pipe(
      map(response => response.map(photo => photo.urls.small))
    );
  }
}
