package com.Paint.Paint.ShapeClass;

public interface IShape {
    int id = 0;
    int x = 0;
    int y = 0;
    int xP = 0;
    int yP = 0;
    String name = "";

    int getx();
    int gety();
    int getxP();
    int getyP();
    String getname(); 
}