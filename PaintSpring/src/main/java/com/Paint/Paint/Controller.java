package com.Paint.Paint;
import java.beans.XMLEncoder;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Stack;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.exc.StreamReadException;

@RestController
@CrossOrigin
@Component
public class Controller
{  
   Object obj;
   //function takes shapeName from front and creates it from ShapeFactory
   @PostMapping("/createShape")
   Object creatShape(@RequestBody String shapeName)
   {
      obj = ShapeFactory.createShape(shapeName)  ; 
      return obj; 
   }
   
   @PostMapping("/store")
   IShape store(@RequestBody sClass Shape)
   {
      return Shape;
   }
  
   Stack<List <sClass> > dataBase = new Stack<>();

   @PostMapping("/sendDatabase")
   void inDatabase(@RequestBody List<sClass> canvas)
   {
      this.dataBase.push(canvas);
   }

   
   @PostMapping("/save")
   String Save(@RequestBody String filename)
   {
      try{
      FileOutputStream fos = new FileOutputStream(filename);
      if (filename.contains(".json")) 
        {
          ObjectMapper map = new ObjectMapper();
          map.writeValue(fos, this.dataBase.peek());
        }   
        else
        {
         XMLEncoder encoder = new XMLEncoder(fos);
         encoder.writeObject(this.dataBase.peek());
         System.out.println(this.dataBase.peek());
         encoder.close();
         fos.close();
        }
        return "SUCCESS";
      }
      catch (IOException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
         return "FAIL";
      }
   }
}

