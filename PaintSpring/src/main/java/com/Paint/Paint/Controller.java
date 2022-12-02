package com.Paint.Paint;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@Component
public class Controller
{  
   sClass Shapeclass = new sClass();
   ShapeFactory shapeFactory = new ShapeFactory();
   Storage storage = new Storage();
   Object obj;
   //function takes shapeName from front and creates it from ShapeFactory
   @PostMapping("/createShape")
   IShape createShape(@RequestBody String Shape)
   { 
      return shapeFactory.createShape(Shape); 
   }
   
   @PostMapping("/store")
   IShape store(@RequestBody sClass Shape)
   {
      storage.recieve(Shape);
     return Shape;    
   }

   // @PostMapping("/get")
   // Object Return(@RequestBody String command)
   // {
   //    return Storage.send();
   // }
}

