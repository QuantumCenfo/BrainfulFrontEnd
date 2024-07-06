import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  private apiUrl = 'https://api.unsplash.com';
  private accessKey = 'gnof3h7Xoxkw_ZN6GY0ErzH6BFoKCRe-choP-c8WR2g'; // Replace with your actual Unsplash access key

   constructor(private http: HttpClient) { }

  getRandomImages(count: number): Observable<string[]> {
    const url = `${this.apiUrl}/photos/random?client_id=${this.accessKey}&count=${count}`;
    return this.http.get<any[]>(url).pipe(
      map(response => response.map(photo => photo.urls.small))
    );
  }
}
