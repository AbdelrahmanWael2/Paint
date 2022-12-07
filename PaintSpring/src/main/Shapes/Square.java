package com.Paint.Paint.Shapes;

public class Square {

    public Square(){}

    public Square(String name, String id, double xP, double yP, double x, double y, String border, double borderWidth, boolean borderScaleEnabled, String fill, boolean fillEnabled, double rotation, double[] points) {
        Name = name;
        this.id = id;
        this.xP = xP;
        this.yP = yP;
        this.x = x;
        this.y = y;
        this.border = border;
        this.borderWidth = borderWidth;
        this.borderScaleEnabled = borderScaleEnabled;
        this.fill = fill;
        this.fillEnabled = fillEnabled;
        this.rotation = rotation;
        this.points = points;
    }

    private String Name = "square";
    private String id = "" ;

    private double xP = 0;
    private double yP = 0;

    private double x = 70;
    private double y = 70;

    private String border = "black";

    private double borderWidth = 5;
    private boolean borderScaleEnabled = false;

    private String fill = "white";
    private boolean fillEnabled = false;
    private double rotation = 0;

    private double points[] = {0,0,100,0};



    public String getName() {
        return Name;
    }
    public void setName(String name) {
        Name = name;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public double getxP() {
        return xP;
    }
    public void setxP(double xP) {
        this.xP = xP;
    }

    public double getyP() {
        return yP;
    }
    public void setyP(double yP) {
        this.yP = yP;
    }

    public double getX() {
        return x;
    }
    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }
    public void setY(double y) {
        this.y = y;
    }

    public String getBorder() {
        return border;
    }
    public void setBorder(String border) {
        this.border = border;
    }

    public double getBorderWidth() {
        return borderWidth;
    }
    public void setBorderWidth(double borderWidth) {
        this.borderWidth = borderWidth;
    }

    public boolean isBorderScaleEnabled() {
        return borderScaleEnabled;
    }
    public void setBorderScaleEnabled(boolean borderScaleEnabled) {
        this.borderScaleEnabled = borderScaleEnabled;
    }

    public String getFill() {
        return fill;
    }
    public void setFill(String fill) {
        this.fill = fill;
    }

    public boolean isFillEnabled() {
        return fillEnabled;
    }
    public void setFillEnabled(boolean fillEnabled) {
        this.fillEnabled = fillEnabled;
    }

    public double getRotation() {
        return rotation;
    }
    public void setRotation(double rotation) {
        this.rotation = rotation;
    }

    public double[] getPoints() {
        return points;
    }
    public void setPoints(double[] points) {
        this.points = points;
    }

    
}
