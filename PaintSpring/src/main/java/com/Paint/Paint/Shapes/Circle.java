package com.Paint.Paint.Shapes;

import com.Paint.Paint.ShapeClass.shapeClass;

public class Circle extends shapeClass {
    public Circle() {
        super("circle", "", 0.0, 0.0, 70.0, 70.0, "black", 5.0, false, "white", false, 0.0,
                new double[] { 0.0, 0.0, 100.0, 0.0 });
    }

    public Circle(String name, String id, double xP, double yP, double x, double y, String border, double borderWidth,
            boolean borderScaleEnabled, String fill, boolean fillEnabled, double rotation, double[] points) {
        super(name, id, xP, yP, x, y, border, borderWidth, borderScaleEnabled, fill, fillEnabled, rotation, points);
    }

    @Override
    public shapeClass clone() {
        shapeClass another = new Circle(getName(), getId(), getxP(), getyP(), getX(), getY(), getBorder(),
                getBorderWidth(), getBorderScaleEnabled(), getFill(),
                getFillEnabled(), getRotation(), getPoints());
        return another;
    }

}
