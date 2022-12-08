import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IShape } from './ishape';


@Injectable({
  providedIn: 'root'
})
export class PaintService {

  constructor(private http: HttpClient) { }

  store(Shape : IShape)
  {
     return this.http.post("http://localhost:9090/store", Shape)
  }

  create(shapeName : String) :Observable<String>
  {
    return this.http.post<String>("http://localhost:9090/createShape", shapeName)
  }
  sendDatabase(canvas : IShape[])
  {
    return this.http.post("http://localhost:9090/sendDatabase", canvas)
  }
  save(filename : String) :Observable<String>
  {
    return this.http.post("http://localhost:9090/save", filename, {responseType:'text'})
  }
  undo(test : string) :Observable<IShape>
  {
    return this.http.post<IShape>("http://localhost:9090/undo", "test")
  }
  redo(test : string) :Observable<IShape>
  {
    return this.http.post<IShape>("http://localhost:9090/redo", "test")
  }
  load(filename : String) :Observable<IShape[]>
  {
    return this.http.post<IShape[]>("http://localhost:9090/load", filename)
  }
  copy(shape : IShape) : Observable<IShape>
  {
    return this.http.post<IShape>("http://localhost:9090/copy", shape)
  }
  edit(shape : IShape)
  {
    return this.http.post("http://localhost:9090/edit", shape)
  }

  getObj(id : string ):Observable<IShape>
  {
    return this.http.post<IShape>("http://localhost:9090/getObj", id)
  }
}
