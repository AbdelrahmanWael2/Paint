import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shape } from './app.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaintService {
  
  shape:any
  response:any

  constructor(private http: HttpClient) { }

  //sends name of shape chosen and sends it to the back
  // getShape(shapeName : String)
  // {
  //    this.http.post("http://localhost:9090/createShape", "rectangle")
  //   .subscribe((res) =>
  //   {
  //     this.response = res
  //     this.shape = this.response
  //     console.log(this.shape)
      
  //   })
    
    
  }

