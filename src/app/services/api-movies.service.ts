import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiMoviesService {
  url: string = 'http://www.omdbapi.com/?i=tt3896198&apikey=b486a51f';
  constructor(private http: HttpClient) {}

  GetMovie(pelicula: string): Observable<any> {
    return this.http.get(`${this.url}&t=${pelicula}`);
  }
}
