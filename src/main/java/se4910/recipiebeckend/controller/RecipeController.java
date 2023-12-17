package se4910.recipiebeckend.controller;

import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.RecipeResponse;
import se4910.recipiebeckend.service.RecipeService;

import java.util.List;

@RestController
@RequestMapping(value = "/recipes", produces = MediaType.APPLICATION_JSON_VALUE)
// @CrossOrigin(origins = "*", allowedHeaders = "*")
public class RecipeController {

    @Autowired
    RecipeService recipeService;
    @GetMapping("/all-recipes")
    public List<Recipe> getAllRecipes()
    {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/all-recipes-rate")
    public List<RecipeResponse> getAllRecipesWithRate()
    {
        return recipeService.getAllRecipesWithRate();
    }

    @PostMapping("/create-recipe")
    public ResponseEntity<String> createRecipe(@RequestBody RecipeRequest recipeRequest)
    {
       return recipeService.createRecipe(recipeRequest);
    }

    @PutMapping("/update-recipe")
    public ResponseEntity<String> updateRecipebyID(@RequestBody RecipeRequest recipeRequest)
    {
        return recipeService.updateRecipe(recipeRequest);
    }

    @DeleteMapping("/delete-recipe/{id}")
    public ResponseEntity<String> deleteRecipeById(@PathVariable Long id) {
        return recipeService.deleteRecipe(id);
    }


    @GetMapping("/getRecipesByMeal")
    public List<Recipe> getRecipesByMeal(@RequestParam String mealType) {

        return recipeService.getRecipesByMeal(mealType);
    }

}
