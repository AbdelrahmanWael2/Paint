package com.Paint.Paint.ShapeClass;

public class shapeClass {

    public shapeClass() {
    }

    public shapeClass(String Name, String id, double xP, double yP, double x, double y, String border,
                      double borderWidth, boolean borderScaleEnabled, String fill, boolean fillEnabled, double rotation,
                      double[] points) {
        this.Name = Name;
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

    private String Name = "";
    private String id = "";

    private double xP = 0;
    private double yP = 0;

    private double x = 70;
    private double y = 50;

    private String border = "black";
    private double borderWidth = 5;
    private boolean borderScaleEnabled = false;

    private String fill = "white";
    private boolean fillEnabled = false;

    private double rotation = 0;
    private double[] points = {};

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

    public boolean getBorderScaleEnabled() {
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

    public boolean getFillEnabled() {
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

    public shapeClass clone() {
        return new shapeClass(Name, id, xP, yP, x, y, border, borderWidth, borderScaleEnabled, fill, fillEnabled,
                rotation, points);
    }

    public boolean compareTo(shapeClass obj) {
        return (Name.equals(obj.getName())) && (id.equals(obj.getId())) && (xP == obj.getxP()) && (yP == obj.getyP())
                && (x == obj.getX()) && (y == obj.getY()) && border.equals(obj.getBorder())
                && (borderScaleEnabled == obj.getBorderScaleEnabled()) && (fill.equals(obj.getFill()))
                && fillEnabled == obj.getFillEnabled() && (rotation == obj.getRotation());
    }

}