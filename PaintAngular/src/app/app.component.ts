import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaintService } from './paint.service';
import Konva from 'konva';
import { IShape } from './ishape';
import { DrawShapes } from './draw-shapes';
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
    
	constructor(private paintService: PaintService){}
	
	title = 'Paint';

	///some flags////////////////
	shapeFlag = "";

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
	Creation: any;

	saveFile(){

	}

	// variables of stage, layer, transformers
	stage: any;
	layer: any;
	tr:any;
	StageWidth: any = 1200;
	StageHeight: number = 800;
	// idCounter: number = 1;
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
			this.layer.add(this.tr);
		}
	}

	

	ngOnInit(flag:boolean): void{
		if(!flag ){
			console.log("refresh")
			this.paintService.refresh("refresh").subscribe();	
		}

		// create object of factory.
		this.Creation = new DrawShapes();
		
		this.StageWidth = document.getElementById("holder")?.clientWidth; 
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
		// this.layer.add(this.tr);


		// added
		this.stage.on("click",(e: any) => {
			//console.log(' in ngonit ');
			var GotID = e.target.attrs.id;
			this.typeShape = e.target.attrs.type;
			if(GotID != undefined){
				this.draggedId = GotID;
				this.SelectedItem = this.stage.findOne("#"+this.draggedId.toString());
				this.SelectedItem.draggable(true);
				this.resize(1);
				
				if( this.SelectedItem.name() === 'line' )
					this.tr.enabledAnchors(['middle-left', 'middle-right']);
				else if(this.SelectedItem.name() === 'circle' || this.SelectedItem.name() === 'square')
					this.tr.enabledAnchors(['top-left','top-right', 'bottom-left' , 'bottom-right',]);
				else
					this.tr.enabledAnchors(['middle-left', 'middle-right','top-left','top-right', 'bottom-left' , 'bottom-right','top-center' ,'bottom-center']);
				this.tr.anchorCornerRadius(10);

				//console.log( "id: " + GotID );
			}
			else 
			{ 
				if(this.SelectedItem != undefined){
					this.SelectedItem.draggable(false);
					this.resize(0);
				}
			}

			// checks moving or resizing
			this.MoveCase();
			this.ResizingCase();
		});
		

	}


	// start editing operations

	sendColor( color: string ){
        var res:any;
		if( this.SelectedItem != undefined ){
			// storing obj after edit in back 
			if( this.fillFlag ){
				this.SelectedItem.fillEnabled(true);
				this.SelectedItem.fill(color);
			}else{
				// this.SelectedItem.fillEnabled(false);
				this.SelectedItem.stroke(color);
			}

            this.paintService.getObj(this.SelectedItem.id()).subscribe((data : any) => 
			{
				res = data,
				res.fillEnabled = this.SelectedItem.fillEnabled(),
				res.fill = this.SelectedItem.fill(),
				res.border = this.SelectedItem.stroke(),
				//console.log(res.fill),
				//console.log(res.stroke),
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
					shape.rotation = this.SelectedItem.rotation();
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
							shape.y = this.SelectedItem.radiusY()*this.SelectedItem.scaleY();
						break;
						case "square":
							shape.x = this.SelectedItem.width()*this.SelectedItem.scaleX();
							shape.y = this.SelectedItem.height()*this.SelectedItem.scaleY();
						break;
						case "line": 
							this.scalePoints(shape);								
						break;
						case "triangle":
							this.scalePoints(shape);
						break;
					}
					// this.SelectedItem.scaleX(1);
					// this.SelectedItem.scaleY(1);
					this.paintService.edit(shape).subscribe();
				})
			});
		}
	}

	scalePoints(shape: IShape){
		for(var i = 0 ; i < this.SelectedItem.points().length/2 ;i++){
			this.SelectedItem.points()[2*i] *= this.SelectedItem.scaleX();
		    this.SelectedItem.points()[2*i+1] *= this.SelectedItem.scaleY();
		}
		this.SelectedItem.scaleX(1);
		this.SelectedItem.scaleY(1);
		shape.points = this.SelectedItem.points();
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
					this.paintService.edit(shape).subscribe();
				})
				//console.log('dragend');
			});	
		}
	}

	DeleteCase(){
		if( this.SelectedItem != undefined ){

			// delete in back
			var shape:IShape
			this.paintService.getObj(this.SelectedItem.id()).subscribe((res : any) => 
			{
				// send to back.
				shape = res,
				shape.id = '-'.concat(shape.id);
				console.log(shape.id);
				this.paintService.edit(res).subscribe();
			});
			// delete tr and destroy.
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
				this.Creation.FactoryFn(shape.name, this.layer, shape);
			});
			// this.idCounter = this.idCounter + 1;
			//console.log('in copy function');

		}
	}

	// end editing operations

	// start creating shapes

	createShapeFn(){
				

		var Shape: IShape;	
		
		// A service call to tell back that the shape is rectangle and return object from factory
		this.paintService.create(this.shapeFlag)
		.subscribe((res: any) => {

			Shape = res; 
			
			this.stage.on("mousedown", () =>{

				Shape.xP = this.stage.getPointerPosition().x;
				Shape.yP = this.stage.getPointerPosition().y;
				this.Creation.FactoryFn(this.shapeFlag, this.layer, Shape);
				this.sendToBack( Shape );
				this.stage.off("mousedown");
			});

		});


		this.layer.draw();
	}

	startDrowFH: boolean = false;
	freeHand(){

		var Shape: IShape;	
		
		// A service call to tell back that the shape is rectangle and return object from factory
		this.paintService.create("line")
		.subscribe((res: any) => {

			Shape = res; 
			const newPoints = [0, 0];
			let lineObj: any;

			console.log(Shape);

			// free hand part 1
			this.stage.on("mousedown", () =>{

				this.startDrowFH = true;

				Shape.xP = this.stage.getPointerPosition().x;
				Shape.yP = this.stage.getPointerPosition().y;
				Shape.points = [0, 0];
				lineObj = this.Creation.drawLine(Shape);
				this.layer.add(lineObj);
				
				
			});

			// free hand part 2
			this.stage.on("mousemove", () => {
				
				if( this.startDrowFH == false ){}
				else {
					newPoints.push(this.stage.getPointerPosition().x - lineObj.x(), this.stage.getPointerPosition().y - lineObj.y());
					lineObj.points(newPoints);
				}

			});

			// free hand part 3
			this.stage.on("mouseup", () => {
				newPoints.push(this.stage.getPointerPosition().x - lineObj.x(), this.stage.getPointerPosition().y - lineObj.y());
				lineObj.points(newPoints);
				this.startDrowFH = false;

				Shape.points = newPoints;
				console.log( newPoints );
				this.sendToBack(Shape);

				this.stage.off("mousedown");
				this.stage.off("mousemove");
				this.stage.off("mouseup");
			});

			

		});
	}

	// end creating shapes

	// start data operations

	renderingData(Arr: IShape[]){
		for( let i = 0; i < Arr.length ; i += 1 ){
			console.log(" id in render:  " + Arr[i].id);
			if( parseInt( Arr[i].id ) < 0 ) continue;
			this.Creation.FactoryFn(Arr[i].name, this.layer, Arr[i]);
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
		//console.log(this.format)
		this.path = (<HTMLInputElement>document.getElementById("path")).value
		this.file = (<HTMLInputElement>document.getElementById("file")).value
		for (var i = 0; i < this.path.length; i++) {
			if(this.path.charAt(i)=="\\")
			  this.path = this.path.substring(0,i) + "/" + this.path.substring(i+1,this.path.length)}

		saveString = this.path  + "/" +  this.file + "." + this.format
		//console.log(saveString)

		if(this.Save){
			this.paintService.save(saveString).subscribe((msg : String) => 
			{
			this.cancel();
			alert(msg)
			});

		
		}else{
			this.paintService.refresh("refresh").subscribe();
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
			//console.log( data );
			// this.idCounter = 1;
			this.Creation.resetId();
			this.renderingData( data );
		});
	}

	redo(){
	this.paintService.redo("test").subscribe((data : any) => {
		this.clear();
		//console.log( data );
		// this.idCounter = 1;
		this.Creation.resetId();
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
		this.ngOnInit(true);

	}

	
}