import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaintService } from './paint.service';

//array of objects to be drawn
const allShapes: any[] = []
 
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
  styleUrls: ['./app.component.css']})

export class AppComponent {


 
  constructor(private paintService: PaintService){}
 
  
  title = 'Paint';
  ///some flags////////////////
  rectangle = false
  X:any
  Y:any
  x:any
  y:any
  // var Shape : IShape|null;
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
    {  var Shape : IShape
      this.paintService.create("rectangle")
      .subscribe((res:any)=> Shape = res)
      
      
      //Captures the position clicked by the user to set the new X and Y
      canvas.addEventListener("click", e=>{
      if(this.rectangle)
      {
      this.X = parseInt(e.offsetX.toString());
      this.Y = parseInt(e.offsetY.toString());
      Shape.xP = this.X
      Shape.yP = this.Y
      
      console.log(Shape)

      //sending the new rectangle to be stored in back
      this.paintService.store(
      {
        x:Shape.x,
        y:Shape.y,
        yP:Shape.yP,
        xP:Shape.xP,
        name:Shape.name
      }).subscribe((data : IShape) => {Shape = data
      ,console.log(allShapes.length),
      console.log(allShapes)
    } )
      allShapes.push(Shape)
      this.draw()
      
      
      console.log(Shape.xP)
      
      }})}}
  //draws given shapes
  draw()
  {
    const canvas: HTMLCanvasElement = this.mycanvas.nativeElement
    const context = canvas.getContext('2d');
    //console.log(allShapes)
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
