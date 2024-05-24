package se4910.recipiebeckend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.RecipeResponse;
import se4910.recipiebeckend.service.RecipeService;

import java.util.List;

@RestController
@RequestMapping("/recipe")
public class RecipeController {

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


}
