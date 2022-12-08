import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaintService } from './paint.service';
import Konva from 'konva';
import { IShape } from './ishape';
import { withLatestFrom } from 'rxjs';
//array of objects to be drawn
//var allShapes : any = []

var fileHandle :any
var fileData : any
var saveForm : any
var saveString:any


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
	path:any
	file:any
	format:any
	Load = false
	Save = false

  	x:any;
  	y:any;
	shapeObj: any;
	SelectedItem: any;

	saveFile(){

	}

	// variables of stage, layer, transformers
	stage: any;
	layer: any;
	tr:any;
	StageWidth: number = 1620;
	StageHeight: number = 800;
	idCounter: number = 1;
	draggedId: number = 1;
	typeShape: String = "";

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
			this.typeShape = e.target.attrs.type;
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
        var res:any
		if( this.SelectedItem != undefined ){
			// storing obj after edit in back 
			if( this.fillFlag ){
				this.SelectedItem.fillEnabled(true);
				this.SelectedItem.fill(color);
			}else{
				this.SelectedItem.stroke(color);
			}
            this.paintService.getObj(this.SelectedItem.id()).subscribe((data : any) => 
			{
				res = data,
				res.fillEnabled = this.SelectedItem.fillEnabled(),
				res.fill = this.SelectedItem.fill(),
				res.border = this.SelectedItem.stroke(),
				console.log(res.fill),
				console.log(res.stroke),
				this.paintService.edit(res).subscribe();
			} )
			
		}

  	}

	ResizingCase(){
		if( this.SelectedItem != undefined ){
			var shape: any;
			
		   	this.SelectedItem.on("transformend", (e: any) =>{
				this.paintService.getObj(this.SelectedItem.id()).subscribe((res : any) => 
				{
					shape = res,
					shape.xP = this.SelectedItem.x(),
					shape.yP = this.SelectedItem.y();
					
					switch(shape.name){
						case "rectangle":
							 shape.x =  this.SelectedItem.width()*this.SelectedItem.scaleX();
						 	 shape.y =  this.SelectedItem.height()*this.SelectedItem.scaleY();
							 
						 		break;
						case "circle": 
							shape.x = this.SelectedItem.radius()*this.SelectedItem.scaleX();
							 break;
						case "ellipse":
							 shape.x =this.SelectedItem.radiusX()*this.SelectedItem.scaleX();
							 shape.y = this.SelectedItem.radiusY()*this.SelectedItem.scaleX();
							  break;
						case "square":
							 	shape.x = this.SelectedItem.width()*this.SelectedItem.scaleX();
								shape.y = this.SelectedItem.height()*this.SelectedItem.scaleY();
							 	 break;
						case "line": 
								shape.points[2] = shape.points[2] + this.SelectedItem.scaleX();
								console.log(shape.points)
						 break;
						case "triangle":
							shape.points = this.SelectedItem.points();
							  break;
					}
                    console.log(shape)
					this.paintService.edit(shape).subscribe();
							
					
				})

				console.log( this.typeShape );
				console.log('transformend');
			});
		}
	}

	MoveCase(){
		if( this.SelectedItem != undefined ){
			this.SelectedItem.on("dragend", () =>{
				// store in back.
				var shape:IShape
				this.paintService.getObj(this.SelectedItem.id()).subscribe((res : any) => 
				{
					shape = res,
					shape.xP = this.SelectedItem.x(),
					shape.yP = this.SelectedItem.y();
					this.paintService.edit(shape).subscribe();})
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
			var shape: IShape;
			this.paintService.copy(this.SelectedItem.id()).subscribe((res: any) => {
				shape = res;
				switch( shape.name ){
					case "rectangle": this.drawRect( shape ); break;
					case "circle": this.drawCircle( shape ); break;
					case "ellipse": this.drawEllipse( shape ); break;
					case "square": this.drawSquare( shape ); break;
					case "line": this.drawLine( shape ); break;
					case "triangle": this.drawTriangle( shape ); break;
				}
			});
			this.idCounter = this.idCounter + 1;
			console.log('in copy function');

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
		console.log(Shape)
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

	openForm(){
		if(this.Save){
			document.getElementById("saveForm")!.style.display = "block"
		}
		else{document.getElementById("loadForm")!.style.display = "block"
			
		}
		
		
	}

	finishForm(){
		
		this.format = (<HTMLSelectElement>document.getElementById('format')).value;
		console.log(this.format)
		this.path = (<HTMLInputElement>document.getElementById("path")).value
		this.file = (<HTMLInputElement>document.getElementById("file")).value
		for (var i = 0; i < this.path.length; i++) {
			if(this.path.charAt(i)=="\\")
			  this.path = this.path.substring(0,i) + "/" + this.path.substring(i+1,this.path.length)}

		saveString = this.path  + "/" +  this.file + "." + this.format
		console.log(saveString)

		if(this.Save){
			this.paintService.save(saveString).subscribe((msg : String) => 
			{
			this.cancel();
			alert(msg)
			});

		
		}else{
			this.paintService.load(saveString).subscribe((allShapes : IShape[]) => {
				this.clear();
				this.renderingData( allShapes );
			});
		document.getElementById("loadForm")!.style.display = "none"}
		this.Save = false
		this.Load = false
		
		
	}
	cancel(){
		document.getElementById("saveForm")!.style.display = "none"
		document.getElementById("loadForm")!.style.display = "none"
		this.Save = false
		this.Load = false
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
