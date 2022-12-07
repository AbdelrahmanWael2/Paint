package com.Paint.Paint.ShapeClass;

public interface IShape {

    String Name = "";
    String id = "";

    double xP = 0;
    double yP = 0;

    double x = 70;
    double y = 50;

    String border = "black";
    double borderWidth = 5;
    boolean borderScaleEnabled = false;

    String fill = "white";
    boolean fillEnabled = false;

    double rotation = 0;
    double[] points = {};

}
