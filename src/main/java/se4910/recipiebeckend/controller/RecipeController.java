package se4910.recipiebeckend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.RecipeInfoResponse;
import se4910.recipiebeckend.response.RecipeResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;
import se4910.recipiebeckend.response.UserRecipeResponseFull;
import se4910.recipiebeckend.service.RecipeService;
import se4910.recipiebeckend.service.UserService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping(value = "/recipes", produces = MediaType.APPLICATION_JSON_VALUE)
// @CrossOrigin(origins = "*", allowedHeaders = "*")
public class RecipeController {

    @Autowired
    RecipeService recipeService;


    @Autowired
    UserService userService;

    @GetMapping("/all-recipes")
    public List<Recipe> getAllRecipes()
    {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/recipe-by-id")
    public Recipe getRecipeById(@RequestParam long id)
    {
        return recipeService.getRecipeByID(id);
    }
    public User getCurrentUser(Authentication authentication) {

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            return userService.getOneUserByUsername(username);
        }
        else {
            return null;
        }
    }

    @GetMapping("/get-custom-data-dashboard")
    public List<RecipeResponse> getCustomDataDashboard(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
           return recipeService.getCustomDataDashboard(currentUser);
        }
        return null;
    }

    @GetMapping("/get-custom-data-userdashboard")
    public List<UserRecipeResponseFull> getCustomDataUserDashboard(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return recipeService.getCustomDataUserDashboard(currentUser);
        }
        return null;
    }

    @GetMapping("/recipe-avg-rates")
    public ResponseEntity<List<String>> recipeRates()
    {
        return recipeService.getRecipeWithRates();
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

    @GetMapping("/getRecipesByCuisine")
    public List<Recipe> getRecipesByCuisine(@RequestParam String cuisine) {
        return recipeService.getRecipesByCuisine(cuisine);
    }

    @GetMapping("/recipe-sort-preptime")
    public List<Recipe> sortRecipesPrepTime()
    {
        return recipeService.sortRecipesPrepTime();
    }

    @GetMapping("/recipe-sort-alph")
    public List<Recipe> sortRecipesAlph()
    {
        return recipeService.sortRecipesAlph();
    }

    @GetMapping("/recipe-sort-rate")
    public List<Recipe> sortRecipesRate()
    {
        return recipeService.sortRecipesRate();
    }

    @GetMapping("/recipe-sort-ingCount")
    public List<Recipe> sortRecipesIngCount() { return recipeService.sortRecipesIngCount();}

    @GetMapping("/user-recipe-dashboard")
    public List<UserRecipeResponse> userRecipes()
    {
        return recipeService.getPublishedUserRecipes();
    }

    @GetMapping("/one-user-published-recipes")
    public List<UserRecipes> publishedRecipesOneUser(@RequestParam String username)
    {
        return recipeService.publishedRecipesOneUser(username);
    }


    @GetMapping("/lower-recipe")
    public void lowerRecipe()
    {
        recipeService.lowerRecipe();
    }
    @GetMapping("/basic-search")
    public List<Recipe> BasicSearch(@RequestParam String targetWord)
    {
        return recipeService.BasicSearch(targetWord);
    }
    @GetMapping("/ingredient-based-search")
    public List<Recipe> IngredientBasedSearch(String TargetIngredients) {
        String[] ingredientsArray = TargetIngredients.split(",");
        List<String> ingredientList = Arrays.asList(ingredientsArray);
        return recipeService.IngredientBasedSearch(ingredientList);
    }

}
