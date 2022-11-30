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
{


   
   

   @PostMapping("/createShape")
   public Shape sendShape(@RequestBody String shapeName)
   {
      if(shapeName.equals("rectangle"))
      {
        Shape rect = new Shape();
        return rect;
      }
      else
      {
         return null;
      }
      
     

   }
}

