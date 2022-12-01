import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

export interface Shape {
    //attributes
    x:number
    y:number
}
//array of objects to be drawn
var shapesBack:Shape[] = [];

  @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    
 constructor(private http:HttpClient){}
  
  title = 'Paint';
  ///some flags////////////////
  rectangle = false
  rect:any
  X:any
  Y:any
  output:any
  x:any
  y:any
  myE:any
  a:any
  b:any
  Rect:any
//////////////////////////////
  @ViewChild('canvas', {static: true }) mycanvas!: ElementRef;
  ngOnInit(): void{
    const canvas: HTMLCanvasElement = this.mycanvas.nativeElement;
    const context = canvas.getContext('2d');
  }

   //gets desired shape from back 
   create()
   {
    const canvas: HTMLCanvasElement = this.mycanvas.nativeElement
    const context = canvas.getContext('2d');
    //rectangle button pressed
    if(this.rectangle == true)
    { 
     // A service call to tell back that the shape is rectangle and return object from factory
      this.http.post("http://localhost:9090/createShape", "rectangle")
      .subscribe((res: any) =>{this.Rect = res, console.log(res)})

      //Captures the position clicked by the user to set the new X and Y
      canvas.addEventListener("click", e=>{
      this.X = parseInt(e.offsetX.toString());
      this.Y = parseInt(e.offsetY.toString());
      this.draw()
      })
    }
   }
  //draws given shape
  draw()
  {
    const canvas: HTMLCanvasElement = this.mycanvas.nativeElement
    const context = canvas.getContext('2d');
      
    //rectangle
    if(context && this.rectangle == true)
    {  
       context.strokeRect(this.X,this.Y,this.Rect.x,this.Rect.y)
    }
  }
     
}
  
   
   
   

     


  
  



