package com.Paint.Paint;

import com.Paint.Paint.Shapes.Circle;
import com.Paint.Paint.Shapes.Ellipse;
import com.Paint.Paint.Shapes.Line;
import com.Paint.Paint.Shapes.Rectangle;
import com.Paint.Paint.Shapes.Square;
import com.Paint.Paint.Shapes.Triangle;

public class ShapeFactory {
    // Make switch case for all shapes to be created
    static Object createShape(String shape) {

        switch (shape) {
            case "rectangle":
                return new Rectangle();

            case "circle":
                return new Circle();

            case "triangle":
                return new Triangle();

            case "ellipse":
                return new Ellipse();

            case "line":
                return new Line();

            case "square":
                return new Square();
            default:
                System.out.println("factory error");
                return null;
        }

    }

}
