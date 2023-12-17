package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.repository.MealRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class MealService {

    MealRepository mealRepository;

    public List<Meal> getAllMeals()
    {
        return mealRepository.findAll();
    }

    public String addOneMealType(String mealType)
    {
        Meal meal = new Meal();
        meal.setMealName(mealType);
        mealRepository.save(meal);

         return  " id: " + meal.getId()+ " "  + mealType + " added successfully";
    }
}
