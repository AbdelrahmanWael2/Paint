package com.Paint.Paint.ShapeClass;

public class shapeClass implements IShape {

    public shapeClass(){};

    private int id = 0;
    private int x = 0;
    private int y = 0;
    private int xP = 0;
    private int yP = 0;
    private String name = "";
    private String error = "error";

    public shapeClass(int id, int x, int y, int xP, int yP, String name){
        id = 0;
        x = 0;
        y = 0;
        xP = 0;
        yP = 0;
        name = ""; 
    };
    
    //Overloading
    public shapeClass(String error)
    {
         error = "Error";
    }

    public int getx() {
        return this.x;
    }
    
    public int getid()
    {
        return this.id;
    }


    public int gety() {
        return this.y;
    }



    public int getxP() {
        return this.xP;
    }



    public int getyP() {
        return this.yP;
    }



    public String getname() {
        return this.name;
    }
  
    public String geterrormsg()
    {
        return this.error;
    }


}