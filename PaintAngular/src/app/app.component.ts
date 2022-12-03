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
	val: number = 1;

	

  	undo = false
//////////////////////////////


	ngOnInit(): void{

		// create container
		this.stage = new Konva.Stage({
			width: this.StageWidth,
			height: this.StageHeight, 
			container: "holder",
		});
		this.stage.getContainer().style.border = '5px solid black';
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
				
				allShapes[ this.val ] = new Konva.Rect({
					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					fill: "blue",
					width: Shape.x,
					height: Shape.y,
					stroke: "black", // border
					strokeWidth: 5,
					draggable: false, // 
					id: this.val.toString() //
					
				});
				this.val = this.val + 1;
				// console.log( this.val );

				allShapes[this.val-1].on("click",function(e: any) {
					var draggedId = e.target.attrs.id;
					console.log(draggedId);
				});

				this.layer.add(allShapes[this.val-1]);
				Shape.xP = allShapes[this.val-1].x();
				Shape.yP = allShapes[this.val-1].y();
				this.rectangleFlag = false;

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

				}				


			
		});



		

		this.layer.draw();
	}
	
	clicking(){
		
	}

  save(){
    this.paintService.save("test.json").subscribe((msg : String) => {alert(msg)});
  }

}
