package com.Paint.Paint;

import com.Paint.Paint.Shapes.Rectangle;

public class ShapeFactory {
    //Make switch case for all shapes to be created
    static Object createShape(String shape)
    {
        if(shape.equals("rectangle"))
        {
            return new Rectangle();
        }
        else {return null;}
    }
    
}
