import Konva from "konva";
import { IShape } from "./ishape";

export class DrawShapes {
    constructor(){}

    // start variables.

    private idCounter: any = 1;

    // end variables.
    public resetId(){ this.idCounter = 1; }
    
    
    
    public FactoryFn(shapeCreated: string, layer: any, shape: IShape){
        let CreatedObj: any;
        switch( shapeCreated ){
            case "rectangle": 
                CreatedObj = this.drawRect( shape ); 
            break;

            case "circle": 
                CreatedObj = this.drawCircle( shape ); 
            break;

            case "ellipse": 
                CreatedObj = this.drawEllipse( shape ); 
            break;
            
            case "square": 
                CreatedObj = this.drawSquare( shape ); 
            break;
            
            case "line": 
                CreatedObj = this.drawLine( shape ); 
            break;
            
            case "triangle": 
                CreatedObj = this.drawTriangle( shape ); 
            break;
        }
        layer.add(CreatedObj);
        console.log("after creation id: " + shape.id);
    }

    drawRect( Shape: IShape ){ //
		let shapeObj = new Konva.Rect({

			x: Shape.xP,
			y: Shape.yP,

			width: Shape.x,
			height: Shape.y,

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 


			stroke: Shape.border, 
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,


            name: Shape.name,
			id: this.idCounter.toString(), 
			draggable: false,
			rotation: Shape.rotation,

		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
        return shapeObj;
	}

	drawCircle( Shape: IShape ){
		let shapeObj = new Konva.Circle({

			x: Shape.xP,
			y: Shape.yP,

			radius: Shape.x, // analogy

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 
			
			stroke:  Shape.border, // "black",
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,

			draggable: false,
            name: Shape.name, 
			id: this.idCounter.toString(),
			rotation: Shape.rotation,
			
		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		return shapeObj;
	}

	drawEllipse(Shape: IShape){

		let shapeObj = new Konva.Ellipse({

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
            name: Shape.name,
			id: this.idCounter.toString(),
			rotation: Shape.rotation,

		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		return shapeObj;
	}

	drawSquare( Shape: IShape ){ // 

		let shapeObj = new Konva.Rect({
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
            name: Shape.name,
			id: this.idCounter.toString(), 
			rotation: 0 // degrees
		});

		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		return shapeObj;

	}

	drawLine( Shape: IShape ){

		let shapeObj = new Konva.Line({

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
			name: Shape.name,
			rotation: Shape.rotation,

		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		return shapeObj;

	}

	drawTriangle( Shape: IShape ){
		let shapeObj = new Konva.Line({
			x: Shape.xP,
			y: Shape.yP,

			fill: Shape.fill,
			fillEnabled: Shape.fillEnabled, 

			stroke: Shape.border, 
			strokeWidth: Shape.borderWidth,
			strokeScaleEnabled: Shape.borderScaleEnabled,

			points: Shape.points, //additional xp, and yp

			draggable: false, 
            name: Shape.name,
			id: this.idCounter.toString(), 
			rotation: Shape.rotation,
			closed: true,
		});
		Shape.id = this.idCounter.toString();
		this.idCounter = this.idCounter + 1;
		return shapeObj;
	}
}
