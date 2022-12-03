import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaintService } from './paint.service';

//array of objects to be drawn
var allShapes: any[] = []

export interface IShape
{
  x:number
  y:number
  xP:number
  yP:number
  name:string
}

  @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    
 constructor(private paintService:PaintService){}
  
  title = 'Paint';
  ///some flags////////////////
  rectangle = false
  X:any
  Y:any
  x:any
  y:any

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
    var Shape : IShape
    //rectangle button pressed
    if(this.rectangle == true)
    { 
     // A service call to tell back that the shape is rectangle and return object from factory
      this.paintService.create("rectangle")
      .subscribe((res: any) =>{Shape = res,console.log(res)})

      //Captures the position clicked by the user to set the new X and Y
      canvas.addEventListener("click", e=>{
      if(this.rectangle)
      {
      this.X = parseInt(e.offsetX.toString());
      this.Y = parseInt(e.offsetY.toString());

      Shape.xP = this.X
      Shape.yP = this.Y 
      
      // allShapes.push(Shape)
      // console.log(allShapes.length)
      // this.draw()

      //sending the new rectangle to be stored in back
      this.paintService.store(
      {
        x:Shape.x,
        y:Shape.y,
        xP:Shape.xP,
        yP:Shape.yP,
        name:Shape.name
      }).subscribe((data : IShape) => {
       Shape = data;
       })
       //this sends the updated canvas "allShapes" to be stored in the database
       allShapes.push(Shape)
       this.draw()
      // console.log(allShapes)
       this.paintService.sendDatabase(allShapes).subscribe()
        
      console.log(Shape.xP)
      

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

   save()
  {
    this.paintService.save("test.json").subscribe((msg : String) => {alert(msg)});
  }
  // Undo()
  // { const canvas: HTMLCanvasElement = this.mycanvas.nativeElement
  //   const context = canvas.getContext('2d');
  //   //clears canvas
  //   if(context)
  //   {context.clearRect(0, 0, canvas.width, canvas.height);}
  //   //pops last shape
  //   if(this.undo)
  //   {allShapes.pop()}
  //   this.undo = false
  //   //redraw the new canvas
  //   this.draw()
  // }
}
