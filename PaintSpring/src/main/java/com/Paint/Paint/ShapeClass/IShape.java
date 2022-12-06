package com.Paint.Paint.ShapeClass;

public interface IShape {
    
    int x = 0;
    int y = 0;
    int xP = 0;
    int yP = 0;
    String id = "";
    String name = "";

    int getx();
    int gety();
    int getxP();
    int getyP();
    String getname(); 
    String getid();
}
