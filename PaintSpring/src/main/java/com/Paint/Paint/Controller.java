package com.Paint.Paint;
import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.apache.tomcat.util.threads.StopPooledThreadException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Paint.Paint.ShapeClass.shapeClass;
import com.fasterxml.jackson.core.exc.StreamReadException;

@RestController
@CrossOrigin
@Component
public class Controller
{  
   Stack<List<shapeClass>> storage = new Stack<>();
   List<shapeClass> temp = new ArrayList<shapeClass>(); 
   Stack<List<shapeClass>> redo = new Stack<>();

   //function takes shapeName from front and creates it from ShapeFactory
   @PostMapping("/createShape")
   Object creatShape(@RequestBody String shapeName)
   {
      return ShapeFactory.createShape(shapeName);
   }
  
   @PostMapping("/store")
   void store(@RequestBody shapeClass Shape)
   {  //adds all shapes to the top stack of lists
      temp = storage.peek();
      temp.add(temp.size(), Shape);
      storage.push(temp);
      redo.clear();
   }

   //send the last shapes that have been drawn
   @PostMapping("/send")
   List<shapeClass> send()
   {
      return storage.peek();
   }
  
   //removes last shape and sends back the list -1
   @PostMapping("/undo")
   shapeClass undo()
   {
     
      if(storage.size() == 0)
      {
         return null;
      }
      else
      {   //pop from storage and send object that should be deleted
          redo.push(storage.pop());
          temp = storage.peek();
          return temp.get(temp.size() - 1);
      }
   }

   //returns a previous list from the storage
   @PostMapping("/redo")
   shapeClass redo()
   {
      storage.push(redo.pop());
      temp = storage.peek();
      return temp.get(temp.size() - 1);
   }
   
   @PostMapping("/save")
   String Save(@RequestBody String filename)
   {
      try{
         FileOutputStream fos = new FileOutputStream(filename);
         if (filename.contains(".json")) 
          {
            ObjectMapper map = new ObjectMapper();
            map.writeValue(fos, storage.peek());
          }   
         else
          {
            XMLEncoder encoder = new XMLEncoder(fos);
            encoder.writeObject(storage.peek());
            System.out.println(storage.peek());
            encoder.close();
            fos.close();
          }
        return "SUCCESS";
      
      }catch(IOException e) {
         e.printStackTrace();
         return "FAIL";
      }
   }

   @PostMapping("/load")
   List<shapeClass> load(@RequestBody String filename)
   {
      try{

      FileInputStream fip = new FileInputStream(filename);

      if(filename.contains(".json"))
      {
         ObjectMapper OM = new ObjectMapper();
         TypeReference tr = new TypeReference<List<shapeClass>>() {};
         storage.push((List<shapeClass>) OM.readValue(fip, tr));
            
      }
      else //XML
      {
         XMLDecoder dec = new XMLDecoder(fip); 
         storage.push((List<shapeClass>) dec.readObject());
         dec.close();
         fip.close();
      }
      
   } catch(IOException e){

         List<shapeClass> Error = new ArrayList<>();
         Error.add(new shapeClass("error"));
      }     
        
        return storage.peek();
   }
}

