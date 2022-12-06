package com.Paint.Paint.Shapes;


public class Rectangle  {
    public Rectangle(){}
    private String id = "" ;
    private int x = 70;
    private int y = 50;
    private int xP = 0;
    private int yP = 0;
    private String Name = "rectangle";

    public Rectangle(String id, int x , int y, int xP, int yP, String name){
         this.id = id;
         this.x = x;
         this.y = y;
         this.xP = xP;
         this.yP = yP;
         this.Name = name;
    }

    public String getid()
    {
        return this.id;
    }
    public int getX()
    {
        return this.x;
    }
    public int getY()
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
    public String getName()
    {
        return this.Name;
    }
 }
 
