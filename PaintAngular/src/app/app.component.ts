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
	shapeFlag = "";
  	rectangleFlag = false;
	circleFlag = false;
	ellipseFlag = false;
	squareFlag = false;
	lineFlag = false;
	triangleFlag = false;
	fillFlag = false;

  	x:any;
  	y:any;
	shapeObj: any;
	SelectedItem: any;


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
			console.log(' in ngonit ');
			var GotID = e.target.attrs.id;
			if(GotID != undefined){
				this.draggedId = GotID;
				this.SelectedItem = this.stage.findOne("#"+this.draggedId.toString());
				this.SelectedItem.draggable(true);
				this.resize(1);
				console.log( "id: " + GotID );
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


	// start editing operations

	sendColor( color: string ){

		if( this.SelectedItem != undefined ){
			// storing obj after edit in back 
			this.SelectedItem.stroke(color);
		}

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

	// end editing operations

	// start creating shapes

	createShapeFn(){
				

		var Shape: IShape;	
		
		// A service call to tell back that the shape is rectangle and return object from factory
		this.paintService.create(this.shapeFlag)
		.subscribe((res: any) =>{

			Shape = res; 
			

			this.stage.on("mousedown", () =>{


				if( this.rectangleFlag ){
	
					Shape.xP = this.stage.getPointerPosition().x;
					Shape.yP = this.stage.getPointerPosition().y;
					this.drawRect( Shape );
					this.sendToBack( Shape );
	
				} 
				else if( this.circleFlag ){
	
					Shape.xP = this.stage.getPointerPosition().x;
					Shape.yP = this.stage.getPointerPosition().y;
					this.drawCircle( Shape );
					this.sendToBack( Shape );
	
				}	
				else if( this.ellipseFlag ){
	
					Shape.xP = this.stage.getPointerPosition().x;
					Shape.yP = this.stage.getPointerPosition().y;
					this.drawEllipse( Shape );
					this.sendToBack( Shape );
	
				}
				else if( this.squareFlag ){
	
					Shape.xP = this.stage.getPointerPosition().x;
					Shape.yP = this.stage.getPointerPosition().y;
					console.log( "in sq case" );
					this.drawSquare( Shape ); 
					this.sendToBack( Shape ); 

				}
				else if( this.lineFlag ){
	
					Shape.xP = this.stage.getPointerPosition().x;
					Shape.yP = this.stage.getPointerPosition().y;
					this.drawLine( Shape );
					this.sendToBack( Shape );			
	
				}
				else if( this.triangleFlag ){
	
					Shape.xP = this.stage.getPointerPosition().x;
					Shape.yP = this.stage.getPointerPosition().y;
					this.drawTriangle( Shape );
					this.sendToBack( Shape );
								
				}
				this.stage.off("mousedown");
			});

			//

		});


		this.layer.draw();
	}

	drawRect( Shape: IShape ){ //
		this.shapeObj = new Konva.Rect({

			x: Shape.xP,
			y: Shape.yP,

			width: Shape.x,
			height: Shape.y,

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 


			stroke: Shape.border, 
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,


			id: this.idCounter.toString(), 
			draggable: false,
			rotation: Shape.rotation,

		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		this.layer.add(this.shapeObj);
		this.rectangleFlag = false;

		console.log('in rectangle creation');
		console.log( Shape.id );
	}

	drawCircle( Shape: IShape ){
		this.shapeObj = new Konva.Circle({

			x: Shape.xP,
			y: Shape.yP,

			radius: Shape.x, // analogy

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 
			
			stroke:  Shape.border, // "black",
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,

			draggable: false, 
			id: this.idCounter.toString(),
			rotation: Shape.rotation,
			
		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		this.layer.add(this.shapeObj);
		this.circleFlag = false;

		console.log( Shape );

		console.log('in circle creation');
		console.log( Shape.id );
	}

	drawEllipse(Shape: IShape){

		this.shapeObj = new Konva.Ellipse({

			x: Shape.xP,
			y: Shape.yP,

			radiusX: Shape.x, // additional
			radiusY: Shape.y, // additional

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 

			stroke: Shape.border, 
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,

			draggable: false, 
			id: this.idCounter.toString(),
			rotation: Shape.rotation,

		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		this.layer.add(this.shapeObj);
		this.ellipseFlag = false;

		console.log('in ellipse creation');
		console.log( Shape.id );

	}

	drawSquare( Shape: IShape ){ // 

		// console.log( Shape );

		this.shapeObj = new Konva.Rect({
			x: Shape.xP,
			y: Shape.yP,

			width: Shape.x,
			height: Shape.y,

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 

			stroke: Shape.border, 
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,

			draggable: false,
			id: this.idCounter.toString(), 
			rotation: 0 // degrees
		});

		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		this.layer.add(this.shapeObj);
		this.squareFlag = false;

		console.log('in square creation');
		console.log( Shape.id );

	}

	drawLine( Shape: IShape ){
		this.shapeObj = new Konva.Line({

			x: Shape.xP,
			y: Shape.yP,

			points: Shape.points, //additional xp, and yp

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 

			stroke: Shape.border, 
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,

			draggable: false, 
			id: this.idCounter.toString(),
			rotation: Shape.rotation,

		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		this.layer.add(this.shapeObj);
		this.lineFlag = false;

		console.log('in line creation');
		console.log( Shape.id );

	}

	drawTriangle( Shape: IShape ){
		this.shapeObj = new Konva.Line({
			x: Shape.xP,
			y: Shape.yP,

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 

			stroke: Shape.border, 
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,

			points: Shape.points, //additional xp, and yp

			draggable: false, 
			id: this.idCounter.toString(), 
			rotation: Shape.rotation,
			closed: true,
		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		this.layer.add(this.shapeObj);
		this.triangleFlag = false;

		console.log('in triangle creation');
		console.log( Shape.id );


	}

	// end creating shapes

	// start data operations

	renderingData(Arr: IShape[]){
		for( let i = 0; i < Arr.length ; i += 1 ){
			switch( Arr[i].name ){
				case "rectangle": this.drawRect( Arr[i] ); break;
				case "circle": this.drawCircle( Arr[i] ); break;
				case "ellipse": this.drawEllipse( Arr[i] ); break;
				case "square": this.drawSquare( Arr[i] ); break;
				case "line": this.drawLine( Arr[i] ); break;
				case "triangle": this.drawTriangle( Arr[i] ); break;
			}
		}
	}

	save(){
		this.paintService.save("test.json").subscribe((msg : String) => {alert(msg)});
	}

	load(){
		this.paintService.load("test.json").subscribe((allShapes : IShape[]) => {
			this.clear();
			this.renderingData( allShapes );
		});
	}

	undo(){
		this.paintService.undo("test").subscribe((data: any) => {
			this.clear();
			console.log( data );
			this.idCounter = 1;
			this.renderingData( data );
		});
	}

	redo(){
	this.paintService.redo("test").subscribe((data : any) => {
		this.clear();
		console.log( data );
		this.idCounter = 1;
		this.renderingData( data );
	});
	}

	// end data operations

	// update name in store
	sendToBack( Shape: IShape ){
		//sending the new rectangle to be stored in back
		this.paintService.store({

			name: Shape.name,
			id: Shape.id,

			xP:Shape.xP,
			yP:Shape.yP,
			
			x:Shape.x,
			y:Shape.y,
			
			border: Shape.border,
			borderWidth: Shape.borderWidth,
			borderScaleEnabled: Shape.borderScaleEnabled,
			
			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled,

			rotation: Shape.rotation,
			points: Shape.points

		}).subscribe();
	}



  	clear(){

		this.stage.destroyChildren();
		this.ngOnInit();

	}



}