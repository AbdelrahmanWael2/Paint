import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaintService } from './paint.service';
import Konva from 'konva';
import { IShape } from './ishape';
import { withLatestFrom } from 'rxjs';

//array of objects to be drawn
//var allShapes : any = []

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
    
	constructor(private paintService:PaintService){}
	title = 'Paint';

	///some flags////////////////
  	rectangleFlag = false;
	circleFlag = false;
	ellipseFlag = false;
	squareFlag = false;
	lineFlag = false;
	triangleFlag = false;
  color:any
  	X:any;
  	Y:any;
  	x:any;
  	y:any;
	shapeObj: any;
	SelectedItem: any;

	// Konva nodes Arr
	// SelectedItems: Konva.Node[] = [];

	// variables of stage, layer, transformers
	stage: any;
	layer: any;
	tr:any;
	StageWidth: number = 1200;
	StageHeight: number = 800;
	idCounter: number = 1;
	draggedId: number = 1;

  Undo = false;
	//////////////////////////////


	resize(n:number){
		if(n==0){
			this.tr.nodes([]);
		}
		else
		{
			let obj = this.stage.findOne("#"+this.draggedId.toString());
			this.tr.nodes([obj]);
		}
	}

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

		// tranformer
		this.tr = new Konva.Transformer({
			anchorStroke: 'white',
			anchorFill: 'cyan',
			anchorSize: 10,
		});
		this.layer.add(this.tr);


		// added
		this.stage.on("click",(e: any) => {
			var GotID = e.target.attrs.id;
			if(GotID != undefined){
				this.draggedId = GotID;
				this.SelectedItem = this.stage.findOne("#"+this.draggedId.toString());
				this.SelectedItem.draggable(true);
				this.resize(1);
			}
			else 
			{ if(this.SelectedItem != undefined){
				this.SelectedItem.draggable(false);
				this.resize(0);}
			}

			// checks moving or resizing
			this.MoveCase();
			this.ResizingCase();
		});

	}


	ResizingCase(){
		if( this.SelectedItem != undefined ){
			this.SelectedItem.on("transformend", () =>{
				// store in back.
				console.log('transformend');
			});
		}
	}

	MoveCase(){
		if( this.SelectedItem != undefined ){
			this.SelectedItem.on("dragend", () =>{
				// store in back.
				console.log('dragend');
			});	
		}
	}

	DeleteCase(){
		if( this.SelectedItem != undefined ){
			// delete in back
			this.resize(0);
			this.SelectedItem.destroy();
		}
	}

	CopyCase(){
		if( this.SelectedItem != undefined ){
			// apply request and get response
			console.log('in copy function');
			var theCopyItem = this.SelectedItem.clone();
			theCopyItem.id(this.idCounter.toString());
			this.idCounter = this.idCounter + 1;
			theCopyItem.x( theCopyItem.x() + 20 );
			theCopyItem.y( theCopyItem.y() + 20 );
			this.layer.add( theCopyItem );

			// all shapes addition
			//allShapes[ this.idCounter-1 ] = theCopyItem;
		}
	}

	coloringCase(){
		if( this.SelectedItem != undefined ){
			// storing obj after edit in back 
			this.SelectedItem.stroke("blue");
		}
	}

	createShapeFn(){
				

		var Shape : IShape;

		// A service call to tell back that the shape is rectangle and return object from factory
		this.paintService.create("rectangle")
		.subscribe((res: any) =>{ Shape = res; });

		// create rectangle
		

		this.stage.on("mousedown", () =>{


			if( this.rectangleFlag ){
				
				this.shapeObj = new Konva.Rect({
					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					fillEnabled: false, // add to interface
					width: Shape.x,
					height: Shape.y,
					stroke: "black", // border // add to interface 
					strokeWidth: 5, // add to interface
					draggable: false, // add to interface
					id: this.idCounter.toString(), // add to interface
					strokeScaleEnabled: false,
				});
				this.idCounter = this.idCounter + 1;
				
				this.layer.add(this.shapeObj);
				Shape.xP = this.shapeObj.x();
				Shape.yP = this.shapeObj.y();
				this.rectangleFlag = false;

         console.log(this.shapeObj.id())
				//sending the new rectangle to be stored in back
				this.paintService.store({
						
          //id: this.idCounter,
            x:Shape.x,
						y:Shape.y,
						xP:Shape.xP,
						yP:Shape.yP,
            id: this.shapeObj.id(),
						name:"rectangle"	
				}).subscribe();

			} 
			// else if( this.circleFlag ){

			// 	this.shapeObj = new Konva.Circle({

			// 		x: this.stage.getPointerPosition().x,
			// 		y: this.stage.getPointerPosition().y,
			// 		fillEnabled: false, // add to interface
			// 		width: Shape.x,
			// 		height: Shape.y,
			// 		stroke: "black", // border // add to interface 
			// 		strokeWidth: 5, // add to interface
			// 		draggable: false, // add to interface
			// 		id: this.idCounter.toString() // add to interface
					
			// 	});
			// 	this.idCounter = this.idCounter + 1;

			// 	var draggedId;
			// 	this.stage.on("click",function(e: any) {
			// 		draggedId = e.target.attrs.id;
			// 	});
			// 	console.log(draggedId);

			// 	this.layer.add(allShapes[this.idCounter-1]);
			// 	Shape.xP = allShapes[this.idCounter-1].x();
			// 	Shape.yP = allShapes[this.idCounter-1].y();
			// 	this.circleFlag = false;


			// 	//sending the new rectangle to be stored in back
			// 	this.paintService.store({
			// 			x:Shape.x,
			// 			y:Shape.y,
			// 			xP:Shape.xP,
			// 			yP:Shape.yP,
      //       id: this.shapeObj.id,
			// 			name:"rectangle"
			// 			// id
			// 	}).subscribe( );

			// }	
			// else if( this.ellipseFlag ){

			// 	allShapes[ this.idCounter ] = new Konva.Ellipse({

			// 		x: this.stage.getPointerPosition().x,
			// 		y: this.stage.getPointerPosition().y,
			// 		radiusX: 100, // additional
			// 		radiusY: 50, // additional
			// 		fillEnabled: false, // add to interface
			// 		stroke: "black", // border // add to interface 
			// 		strokeWidth: 5, // add to interface
			// 		draggable: false, // add to interface
			// 		id: this.idCounter.toString() // add to interface

			// 	});
			// 	this.idCounter = this.idCounter + 1;
			// 	this.layer.add(allShapes[this.idCounter-1]);
			// 	Shape.xP = allShapes[this.idCounter-1].x();
			// 	Shape.yP = allShapes[this.idCounter-1].y();
			// 	this.ellipseFlag = false;


			// 	//sending the new rectangle to be stored in back
			// 	this.paintService.store({
			// 			x:Shape.x,
			// 			y:Shape.y,
			// 			xP:Shape.xP,
			// 			yP:Shape.yP,
      //       id: this.shapeObj.id,
			// 			name:"rectangle"
			// 			// id
			// 	}).subscribe();

			// }
			// else if( this.squareFlag ){

			// 	allShapes[ this.idCounter ] = new Konva.RegularPolygon({
			// 		x: this.stage.getPointerPosition().x,
			// 		y: this.stage.getPointerPosition().y,
			// 		sides: 4, // additional
			// 		radius: 20, // additional // initial radius of circle that contains the recangle
			// 		rotation: 45, // additional 
			// 		// fillEnabled: false, // add to interface
			// 		fillEnabled: false, // add to interface
			// 		stroke: "black", // border // add to interface 
			// 		strokeWidth: 5, // add to interface
			// 		draggable: false, // add to interface
			// 		id: this.idCounter.toString() // add to interface
			// 	});
			// 	this.idCounter = this.idCounter + 1;
			// 	this.layer.add(allShapes[this.idCounter-1]);
			// 	Shape.xP = allShapes[this.idCounter-1].x();
			// 	Shape.yP = allShapes[this.idCounter-1].y();
			// 	this.squareFlag = false;


			// 	//sending the new rectangle to be stored in back
			// 	this.paintService.store({
			// 			x:Shape.x,
			// 			y:Shape.y,
			// 			xP:Shape.xP,
			// 			yP:Shape.yP,
      //       id: this.shapeObj.id,
			// 			name:"rectangle"
			// 			// id
			// 	}).subscribe();

			// }
			// else if( this.lineFlag ){
			// 	allShapes[ this.idCounter ] = new Konva.Line({
			// 		x: this.stage.getPointerPosition().x,
			// 		y: this.stage.getPointerPosition().y,
			// 		points: [0, 0, 100, 0], //additional xp, and yp
			// 		// fillEnabled: false, // reduced
			// 		stroke: "black", // border // add to interface 
			// 		strokeWidth: 5, // add to interface
			// 		draggable: false, // add to interface
			// 		id: this.idCounter.toString() // add to interface
			// 	  });
			// 	this.idCounter = this.idCounter + 1;
			// 	this.layer.add(allShapes[this.idCounter-1]);
			// 	Shape.xP = allShapes[this.idCounter-1].x();
			// 	Shape.yP = allShapes[this.idCounter-1].y();
			// 	this.lineFlag = false;


			// 	//sending the new rectangle to be stored in back
			// 	this.paintService.store({
			// 			x:Shape.x,
			// 			y:Shape.y,
			// 			xP:Shape.xP,
			// 			yP:Shape.yP,
      //       id: this.shapeObj.id,
			// 			name:"rectangle"
			// 			// id
			// 	}).subscribe();
			// }
			// else if( this.triangleFlag ){
			// 	allShapes[ this.idCounter ] = new Konva.Line({
			// 		x: this.stage.getPointerPosition().x,
			// 		y: this.stage.getPointerPosition().y,
			// 		points: [0, 0, 0, 100, 100, 100], //additional xp, and yp
			// 		closed: true,
			// 		fillEnabled: false, // add to interface
			// 		stroke: "black", // border // add to interface 
			// 		strokeWidth: 5, // add to interface
			// 		draggable: false, // add to interface
			// 		id: this.idCounter.toString() // add to interface
			// 	  });
			// 	this.idCounter = this.idCounter + 1;
			// 	this.layer.add(allShapes[this.idCounter-1]);
			// 	Shape.xP = allShapes[this.idCounter-1].x();
			// 	Shape.yP = allShapes[this.idCounter-1].y();
			// 	this.triangleFlag = false;


			// 	//sending the new rectangle to be stored in back
			// 	this.paintService.store({
			// 			x:Shape.x,
			// 			y:Shape.y,
			// 			xP:Shape.xP,
			// 			yP:Shape.yP,
      //       id: this.shapeObj.id,
			// 			name:"rectangle"
			// 	}).subscribe();
			// }
		});
		this.layer.draw();
	}

  save(){
    this.paintService.save("test.json").subscribe((msg : String) => {alert(msg)});
  }

  load(){
    this.paintService.load("test.json").subscribe((allShapes : IShape[]) => {})
  }

  undo(){
    this.paintService.undo("test").subscribe((Shape : IShape) => {
      this.clear()
    });
  }

  redo(){
    this.paintService.redo("test").subscribe((Shape : IShape) => {})
  }

  //draws a list
  draw(){

  }

  clear(){
    var cl = new Konva.Rect({
      x:0,
      y:0,
      width: this.StageWidth,
      height: this.StageHeight,
      fill: "white"
      }) ;
      this.layer.add(cl)
  }

  sendColor(){

  }

}