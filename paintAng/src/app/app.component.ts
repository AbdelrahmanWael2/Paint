import { Component } from '@angular/core';
import { PaintService } from './paint.service';
import Konva from 'konva';
import { IShape } from './ishape';
import { DrawShapes } from './draw-shapes';
import Pickr from '@simonwep/pickr';

var saveString:any
var allShapes : any = [];
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {

    
	constructor(private paintService: PaintService){}
	
	title = 'Paint';

	/// flags
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

	// variables of stage, layer, transformers
	stage: any;
	layer: any;
	tr:any;
	StageWidth: any = 1200;
	StageHeight: number = 800;
	draggedId: number = 1;
	typeShape: String = "";
  
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
			this.paintService.refresh("refresh").subscribe();	
			this.palet();
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

		// added
		this.stage.on("click",(e: any) => {
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

	coloringFront(color: string){
		//storing obj after edit in back 
		if( this.fillFlag ){
			this.SelectedItem.fillEnabled(true);
			this.SelectedItem.fill(color);
		}else{
			this.SelectedItem.stroke(color);
		}
	}

	sendColor(color: string){
        var res:any;
		if( this.SelectedItem != undefined ){
			this.coloringFront(color);

            this.paintService.getObj(this.SelectedItem.id()).subscribe((data : any) => 
			{
				res = data,
				res.fillEnabled = this.SelectedItem.fillEnabled(),
				res.fill = this.SelectedItem.fill(),
				res.border = this.SelectedItem.stroke(),
				this.paintService.edit(res).subscribe();
			})	
		}
  	}

	palet(){
		const pickr = Pickr.create({
			el: '.color-picker',
			theme: 'classic', 
			default: 'red',
			useAsButton: true,
			swatches: [
				'rgba(244, 67, 54, 1)',
				'rgba(233, 30, 99, 0.95)',
				'rgba(156, 39, 176, 0.9)',
				'rgba(103, 58, 183, 0.85)',
				'rgba(63, 81, 181, 0.8)',
				'rgba(33, 150, 243, 0.75)',
				'rgba(3, 169, 244, 0.7)',
				'rgba(0, 188, 212, 0.7)',
				'rgba(0, 150, 136, 0.75)',
				'rgba(76, 175, 80, 0.8)',
				'rgba(139, 195, 74, 0.85)',
				'rgba(205, 220, 57, 0.9)',
				'rgba(255, 235, 59, 0.95)',
				'rgba(255, 193, 7, 1)'
			],
		
			components: {
		
				// Main components
				preview: true,
				opacity: true,
				hue: true,
		
				// Input / output Options
				interaction: {
					hex: true,
					rgba: true,
					hsla: true,
					hsva: true,
					cmyk: true,
					input: true,
					clear: true,
					save: true
				}
			}
		});
		var GeneralColor: any;
		pickr.on('change', (color:any,instance:any) => {
			color = color.toHEXA();
			const hexColor = "#" + color[0] + color[1] + color[2];
			this.coloringFront(hexColor);
			GeneralColor = hexColor;
			pickr.off('change',()=>{});
		});

		pickr.on('changestop', (instance:any) => {

			this.sendColor(GeneralColor);
			pickr.off('change',()=>{});

		});

		pickr.on('save', (instance:any) => {

			this.sendColor(GeneralColor);
			pickr.off('change',()=>{});

		});


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
			console.log( this.SelectedItem.id() );
			var shape: IShape;
			this.paintService.copy(this.SelectedItem.id()).subscribe((res: any) => {
				shape = res;
				this.Creation.FactoryFn(shape.name, this.layer, shape);
			});
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
			if( parseInt( Arr[i].id ) < 0 ) {
				this.Creation.incId();
				continue;
			}
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
		this.path = (<HTMLInputElement>document.getElementById("path")).value
		this.file = (<HTMLInputElement>document.getElementById("file")).value
		for (var i = 0; i < this.path.length; i++) {
			if(this.path.charAt(i)=="\\")
			  this.path = this.path.substring(0,i) + "/" + this.path.substring(i+1,this.path.length)}

		saveString = this.path  + "/" +  this.file + "." + this.format

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
				this.Creation.resetId();
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
			this.Creation.resetId();
			this.renderingData( data );
		});
	}

	redo(){
	this.paintService.redo("test").subscribe((data : any) => {
		this.clear();
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