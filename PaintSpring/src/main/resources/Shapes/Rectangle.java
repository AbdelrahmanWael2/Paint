package com.Paint.Paint.Shapes;

import com.Paint.Paint.IShape;

public class Rectangle implements IShape {
    public Rectangle(){}
    private int x = 120;
    private int y = 70;
    private int xP = 0;
    private int yP = 0;
    private String name = "rectangle";


    public int getx()
    {
        return this.x;
    }
    public int gety()
    {
        return this.y;
    }
    public int getxP()
    {
        return this.xP;
    }
    public int getyP()
    {
        return this.yP;
    }
    public String getname()
    {
        return this.name;
    }
 }
 
