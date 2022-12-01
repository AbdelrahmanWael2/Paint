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
//@RequestMapping("/")
public class Controller
{  Object obj;

   //function takes shapeName from front and creates it from ShapeFactory
   @PostMapping("/createShape")
   Object creatShape(@RequestBody String shapeName)
   {
      obj = ShapeFactory.createShape(shapeName)  ; 
     
      return obj;

   }
}

