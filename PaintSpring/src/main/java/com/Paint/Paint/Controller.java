package com.Paint.Paint;

import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Paint.Paint.ShapeClass.shapeClass;

import static java.lang.Integer.parseInt;

@RestController
@CrossOrigin
@Component
public class Controller {
   Stack<List<shapeClass>> storage = new Stack<>();
   List<shapeClass> temp = new ArrayList<shapeClass>();
   Stack<List<shapeClass>> redo = new Stack<>();

   // function takes shapeName from front and creates it from ShapeFactory
   @PostMapping("/createShape")
   Object creatShape(@RequestBody String shapeName) {
      return ShapeFactory.createShape(shapeName);
   }

   @PostMapping("/store")
   void store(@RequestBody shapeClass Shape) {
      // adds all shapes to the top stack of lists
      List<shapeClass> Cloned = new ArrayList<shapeClass>();
      if (storage.isEmpty() == false) {
         Cloned = getClone();
      }
      Cloned.add(Cloned.size(), Shape);
      storage.push(Cloned);
      redo.clear();
   }

   // send the last shapes that have been drawn
   @PostMapping("/send")
   List<shapeClass> send() {
      return storage.peek();
   }

   // removes last shape and sends back the list -1
   @PostMapping("/undo")
   List<shapeClass> undo(@RequestBody String test) {

      try {
         if (storage.size() == 0) {
            return new ArrayList<shapeClass>(0);
         }
         redo.push(storage.pop());
         return storage.peek();
      } catch (Exception e) {
         return new ArrayList<shapeClass>(0);
      }
   }

   // returns a previous list from the storage
   @PostMapping("/redo")
   List<shapeClass> redo(@RequestBody String test) {
      try {
         storage.push(redo.pop());
         return storage.peek();
      } catch (Exception e) {
         return storage.peek();
      }
   }

   @PostMapping("/save")
   String Save(@RequestBody String filename) {
      try {
         FileOutputStream fos = new FileOutputStream(filename);
         if (filename.contains(".json")) {
            ObjectMapper map = new ObjectMapper();
            map.writeValue(fos, storage.peek());
         } else {
            XMLEncoder encoder = new XMLEncoder(fos);
            encoder.writeObject(storage.peek());
            encoder.close();
            fos.close();
         }
         return "SUCCESS";

      } catch (IOException e) {
         e.printStackTrace();
         return "FAIL";
      }
   }

   @PostMapping("/load")
   List<shapeClass> load(@RequestBody String filename) {
      try {

         FileInputStream fip = new FileInputStream(filename);

         if (filename.contains(".json")) {
            ObjectMapper OM = new ObjectMapper();
            TypeReference tr = new TypeReference<List<shapeClass>>() {
            };
            storage.push((List<shapeClass>) OM.readValue(fip, tr));

         } else // XML
         {
            XMLDecoder dec = new XMLDecoder(fip);
            storage.push((List<shapeClass>) dec.readObject());
            storage.pop();
            dec.close();
            fip.close();
         }

      } catch (IOException e) {

         List<shapeClass> Error = new ArrayList<>();
      }

      return storage.peek();
   }

   @PostMapping("/copy")
   shapeClass copy(@RequestBody String id) {
      temp = storage.peek();
      shapeClass newObj = temp.get(parseInt(id) - 1).clone();
      newObj.setId(String.format("%d", temp.size()));
      newObj.setxP(newObj.getxP() + 20.0);
      newObj.setyP(newObj.getyP() + 20.0);
      store(newObj);
      return newObj;
   }

   // move resize coloring
   @PostMapping("/edit")
   void edit(@RequestBody shapeClass shape) {

      List<shapeClass> Cloned = getClone();
      int GotId = parseInt(shape.getId());
      if (GotId > 0 && shape.compareTo(Cloned.get(GotId - 1))) {
         return;
      }
      if (GotId > 0)
         Cloned.set(GotId - 1, shape);
      else
         Cloned.set(-1 * GotId - 1, shape);
      storage.push(Cloned);

   }

   @PostMapping("/getObj")
   shapeClass getObj(@RequestBody String id) {
      return storage.peek().get(parseInt(id) - 1);
   }

   List<shapeClass> getClone() {
      temp = storage.peek();
      List<shapeClass> Cloned = new ArrayList<shapeClass>();
      for (int i = 0; i < temp.size(); i++) {
         shapeClass shapeClassObj = temp.get(i).clone();
         Cloned.add(shapeClassObj);
      }
      return Cloned;
   }

   @PostMapping("/refresh")
   void refresh(@RequestBody String state) {
      storage.clear();
   }
}
