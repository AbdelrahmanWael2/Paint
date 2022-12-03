import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaintService } from './paint.service';
import Konva from 'konva';
import { IShape } from './ishape';

//array of objects to be drawn
var allShapes: any[] = []


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
    
 constructor(private paintService:PaintService){}
  
title = 'Paint';
///some flags////////////////
  	rectangleFlag = false
	circle = false

  	X:any;
  	Y:any;
  	x:any;
  	y:any;
	FactoryBuilder: any;
	shapeObj: any;

	// variables of stage
	stage: any;
	layer: any;
	StageWidth: number = 800;
	StageHeight: number = 800;

	rec: any;

  	undo = false
//////////////////////////////


	ngOnInit(): void{

		// create container
		this.stage = new Konva.Stage({
			width: this.StageWidth,
			height: this.StageHeight, 
			container: "holder",
		});
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);
		
	}


	createRect(){
				

		var Shape : IShape;

		// A service call to tell back that the shape is rectangle and return object from factory
		this.paintService.create("rectangle")
		.subscribe((res: any) =>{ Shape = res; });

		// create rectangle
		

		this.stage.on("mousedown", () =>{


			if( this.rectangleFlag ){
				
				this.rec = new Konva.Rect({
					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					fill: "blue",
					width: Shape.x,
					height: Shape.y,
					stroke: "black", // border
					strokeWidth: 5,
					// id
				});
				this.layer.add(this.rec);
				Shape.xP = this.rec.x();
				Shape.yP = this.rec.y();
				this.rectangleFlag = false;

			}				


			//sending the new rectangle to be stored in back
			this.paintService.store(
			{
				x:Shape.x,
				y:Shape.y,
				xP:Shape.xP,
				yP:Shape.yP,
				name:"rectangle"
				// id
			}).subscribe((data : IShape) => {
				Shape = data;
				console.log( Shape );
			});
		});



		

		this.layer.draw();
	}

  save(){
    this.paintService.save("test.json").subscribe((msg : String) => {alert(msg)});
  }

}
