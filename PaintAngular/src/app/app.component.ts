import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

//array of objects to be drawn
var allShapes: any[] = []

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
  X:any
  Y:any
  x:any
  y:any
  Shape:any
  undo = false
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
      .subscribe((res: any) =>{this.Shape = res, console.log(res)})

      //Captures the position clicked by the user to set the new X and Y
      canvas.addEventListener("click", e=>{
      if(this.rectangle)
      {
      this.X = parseInt(e.offsetX.toString());
      this.Y = parseInt(e.offsetY.toString());
      this.Shape.xP = this.X
      this.Shape.yP = this.Y
      allShapes.push(this.Shape)
      console.log(allShapes.length)
      this.draw()
      }})}}
  //draws given shapes
  draw()
  {
    const canvas: HTMLCanvasElement = this.mycanvas.nativeElement
    const context = canvas.getContext('2d');
    console.log(allShapes)
    for(let i = 0 ; i < allShapes.length; i++)
    { 
       if(context && allShapes[i].name === "rectangle" )
       {
        context.strokeRect(allShapes[i].xP,allShapes[i].yP,allShapes[i].x,allShapes[i].y)
        this.rectangle = false
       }
    }
    
  }
  Undo()
  { const canvas: HTMLCanvasElement = this.mycanvas.nativeElement
    const context = canvas.getContext('2d');
    //clears canvas
    if(context)
    {context.clearRect(0, 0, canvas.width, canvas.height);}
    //pops last shape
    if(this.undo)
    {allShapes.pop()}
    this.undo = false
    //redraw the new canvas
    this.draw()
  }
}
