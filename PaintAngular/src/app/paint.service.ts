import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IShape } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class PaintService {

  constructor(private http: HttpClient) { }

  store(Shape : IShape) : Observable<IShape>
  {
     return this.http.post<IShape>("http://localhost:9090/store", Shape)
  }

  create(shapeName : String) :Observable<String>
  {
    return this.http.post<String>("http://localhost:9090/createShape", shapeName)
  }
}
