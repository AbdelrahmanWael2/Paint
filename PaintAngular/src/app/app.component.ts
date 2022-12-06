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
  	rectangleFlag = false;
	circleFlag = false;
	ellipseFlag = false;
	squareFlag = false;
	lineFlag = false;
	triangleFlag = false;

  	X:any;
  	Y:any;
  	x:any;
  	y:any;
	tr:any;
	FactoryBuilder: any;
	shapeObj: any;

	// variables of stage
	stage: any;
	layer: any;
	StageWidth: number = 800;
	StageHeight: number = 800;
	idCounter: number = 1;
	draggedId: number = 1;

  	undo = false;
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
		var obj: any;
		this.stage.on("click",(e: any) => {
			e.evt.preventDefault();
			console.log("abdoooooo");
			var sii = e.target.attrs.id;
			console.log( sii );
			if(sii != undefined){
				this.draggedId = sii;
				allShapes[this.draggedId].draggable(true);
				this.resize(1);
				console.log( sii );
			}
			else
			{
				allShapes[this.draggedId].draggable(false);
				// console.log( sii );
				this.resize(0);
			}
			obj = this.stage.findOne("#"+this.draggedId.toString());

			// //all these function must refer to store
			// //indicate start resizing not needed
			// obj.on('transformstart', () => {
			// 	console.log('transform start');
			// });
			// //indicate end resizing 
			// obj.on('transformend', () => {
			// 	//call store
			// 	console.log('transform end');
			// });
			// //indicate end draging
			// obj.on('dragend', () => {
			// 	console.log('drag end');
			// });

		});

	}




	createRect(){
				

		var Shape : IShape;

		// A service call to tell back that the shape is rectangle and return object from factory
		this.paintService.create("rectangle")
		.subscribe((res: any) =>{ Shape = res; });

		// create rectangle
		

		this.stage.on("mousedown", () =>{


			if( this.rectangleFlag ){
				
				allShapes[ this.idCounter ] = new Konva.Rect({
					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					fillEnabled: false, // add to interface
					width: Shape.x,
					height: Shape.y,
					stroke: "black", // border // add to interface 
					strokeWidth: 5, // add to interface
					draggable: false, // add to interface
					id: this.idCounter.toString() // add to interface
					
				});
				this.idCounter = this.idCounter + 1;
				
				this.layer.add(allShapes[this.idCounter-1]);
				Shape.xP = allShapes[this.idCounter-1].x();
				Shape.yP = allShapes[this.idCounter-1].y();
				this.rectangleFlag = false;


				//sending the new rectangle to be stored in back
				this.paintService.store({
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
			else if( this.circleFlag ){

				allShapes[ this.idCounter ] = new Konva.Circle({

					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					fillEnabled: false, // add to interface
					width: Shape.x,
					height: Shape.y,
					stroke: "black", // border // add to interface 
					strokeWidth: 5, // add to interface
					draggable: false, // add to interface
					id: this.idCounter.toString() // add to interface
					
				});
				this.idCounter = this.idCounter + 1;

				var draggedId;
				this.stage.on("click",function(e: any) {
					draggedId = e.target.attrs.id;
				});
				console.log(draggedId);

				this.layer.add(allShapes[this.idCounter-1]);
				Shape.xP = allShapes[this.idCounter-1].x();
				Shape.yP = allShapes[this.idCounter-1].y();
				this.circleFlag = false;


				//sending the new rectangle to be stored in back
				this.paintService.store({
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
			else if( this.ellipseFlag ){

				allShapes[ this.idCounter ] = new Konva.Ellipse({

					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					radiusX: 100, // additional
					radiusY: 50, // additional
					fillEnabled: false, // add to interface
					stroke: "black", // border // add to interface 
					strokeWidth: 5, // add to interface
					draggable: false, // add to interface
					id: this.idCounter.toString() // add to interface

				});
				this.idCounter = this.idCounter + 1;
				this.layer.add(allShapes[this.idCounter-1]);
				Shape.xP = allShapes[this.idCounter-1].x();
				Shape.yP = allShapes[this.idCounter-1].y();
				this.ellipseFlag = false;


				//sending the new rectangle to be stored in back
				this.paintService.store({
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
			else if( this.squareFlag ){

				allShapes[ this.idCounter ] = new Konva.RegularPolygon({
					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					sides: 4, // additional
					radius: 20, // additional // initial radius of circle that contains the recangle
					rotation: 45, // additional 
					// fillEnabled: false, // add to interface
					fillEnabled: false, // add to interface
					stroke: "black", // border // add to interface 
					strokeWidth: 5, // add to interface
					draggable: false, // add to interface
					id: this.idCounter.toString() // add to interface
				});
				this.idCounter = this.idCounter + 1;
				this.layer.add(allShapes[this.idCounter-1]);
				Shape.xP = allShapes[this.idCounter-1].x();
				Shape.yP = allShapes[this.idCounter-1].y();
				this.squareFlag = false;


				//sending the new rectangle to be stored in back
				this.paintService.store({
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
			else if( this.lineFlag ){
				allShapes[ this.idCounter ] = new Konva.Line({
					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					points: [0, 0, 100, 0], //additional xp, and yp
					// fillEnabled: false, // reduced
					stroke: "black", // border // add to interface 
					strokeWidth: 5, // add to interface
					draggable: false, // add to interface
					id: this.idCounter.toString() // add to interface
				  });
				this.idCounter = this.idCounter + 1;
				this.layer.add(allShapes[this.idCounter-1]);
				Shape.xP = allShapes[this.idCounter-1].x();
				Shape.yP = allShapes[this.idCounter-1].y();
				this.lineFlag = false;


				//sending the new rectangle to be stored in back
				this.paintService.store({
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
			else if( this.triangleFlag ){
				allShapes[ this.idCounter ] = new Konva.Line({
					x: this.stage.getPointerPosition().x,
					y: this.stage.getPointerPosition().y,
					points: [0, 0, 0, 100, 100, 100], //additional xp, and yp
					closed: true,
					fillEnabled: false, // add to interface
					stroke: "black", // border // add to interface 
					strokeWidth: 5, // add to interface
					draggable: false, // add to interface
					id: this.idCounter.toString() // add to interface
				  });
				this.idCounter = this.idCounter + 1;
				this.layer.add(allShapes[this.idCounter-1]);
				Shape.xP = allShapes[this.idCounter-1].x();
				Shape.yP = allShapes[this.idCounter-1].y();
				this.triangleFlag = false;


				//sending the new rectangle to be stored in back
				this.paintService.store({
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
	


  save(){
    this.paintService.save("test.json").subscribe((msg : String) => {alert(msg)});
  }

}
