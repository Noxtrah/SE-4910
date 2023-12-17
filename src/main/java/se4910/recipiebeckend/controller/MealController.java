package se4910.recipiebeckend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.service.MealService;

import java.util.List;

@RestController
@RequestMapping(value = "/meals", produces = MediaType.APPLICATION_JSON_VALUE)
public class MealController {


    @Autowired
    MealService mealService;


    @GetMapping("all-meals")
    public List<Meal> getAllMeals()
    {
        return  mealService.getAllMeals();
    }

    @PostMapping("/add-mealType")
    public String addOneMeal(@RequestParam String mealType){

        return mealService.addOneMealType(mealType);
    }

}
