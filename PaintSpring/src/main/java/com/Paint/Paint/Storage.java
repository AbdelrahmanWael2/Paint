package com.Paint.Paint;

import java.util.Vector;

public class Storage {
    //vector to store shapes from front
     Vector<IShape> shapes = new Vector<IShape>();
     public void recieve(IShape shape)
    {   
        shapes.add(shape);
    }
   
}
