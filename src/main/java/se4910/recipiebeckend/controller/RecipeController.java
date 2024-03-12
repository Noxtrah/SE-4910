package se4910.recipiebeckend.controller;

import jakarta.persistence.Cacheable;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.RecipeResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;
import se4910.recipiebeckend.response.UserRecipeResponseFull;
import se4910.recipiebeckend.service.RecipeService;
import se4910.recipiebeckend.service.UserService;

import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@RestController
@RequestMapping(value = "/recipes", produces = MediaType.APPLICATION_JSON_VALUE)
// @CrossOrigin(origins = "*", allowedHeaders = "*")
public class RecipeController {

    @Autowired
    RecipeService recipeService;


    @Autowired
    UserService userService;


    private List<Recipe> cachedData;

    private List<RecipeResponse> cachedDataExtended;

    @GetMapping("/all-recipes")
    public List<Recipe> getAllRecipes()
    {
        return recipeService.getAllRecipesBasic();
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



   /* public List<RecipeResponse> paging(List<Recipe> cachedData , User user , int key)
    {
        if (user != null) {
            return recipeService.pagingWithUser(cachedData,key, user);
        }
        else {
            System.out.println(cachedData);
            return recipeService.paging(cachedData,key);
        }

    }*/

    @GetMapping("/paging")
    public List<RecipeResponse> paging( @RequestParam(name = "key", defaultValue = "0") int key)
    {
        return recipeService.doPaging(cachedDataExtended,key);

    }

    private void updateCachedData(User currentUser) {
        if (currentUser != null) {
            cachedDataExtended = recipeService.fillResponse(cachedData, currentUser);
        } else {
            cachedDataExtended = recipeService.fillResponseDefaults(cachedData);
        }
    }


    //*************************************************************************
    @GetMapping("/home")
    public List<RecipeResponse> home(Authentication authentication)
    {
            User currentUser = getCurrentUser(authentication);
            cachedData = recipeService.getAllRecipes();
            setCachedData(cachedData);
            if (currentUser != null){

               cachedDataExtended =  recipeService.fillResponse(cachedData,currentUser);
            }
            else {
                cachedDataExtended = recipeService.fillResponseDefaults(cachedData);
            }
            setCachedDataExtended(cachedDataExtended);

            return paging(0);

    }


    @GetMapping("/get-custom-data-userdashboard")
    public List<UserRecipeResponseFull> getCustomDataUserDashboard(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return recipeService.getCustomDataUserDashboard(currentUser);
        }
        else {
           return recipeService.getUserRecipes();
        }
    }

    @PostMapping("/create-recipe")
    public ResponseEntity<String> createRecipe(@RequestBody RecipeRequest recipeRequest)
    {
       return recipeService.createRecipe(recipeRequest);
    }

    @PostMapping("/create-recipe-blob")
    public ResponseEntity<String> createREcipeBlob(@RequestBody RecipeRequest recipeRequest)
    {
        return recipeService.createRecipeBlob(recipeRequest);
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
    public List<RecipeResponse> getRecipesByMeal(@RequestParam String mealType,Authentication authentication) {

       User currentUser = getCurrentUser(authentication);
       cachedData = recipeService.getRecipesByMeal(mealType);
       updateCachedData(currentUser);
       return paging(0);
    }

    @GetMapping("/getRecipesByCuisine")
    public List<RecipeResponse> getRecipesByCuisine(@RequestParam String cuisine, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        cachedData = recipeService.getRecipesByCuisine(cuisine);
        updateCachedData(currentUser);
        return paging(0); // Assuming page 0 as initial page
    }


    @GetMapping("/recipe-sort-preptime")
    public List<RecipeResponse> sortRecipesPrepTime() {
        cachedDataExtended = recipeService.sortRecipesPrepTime(cachedDataExtended);
        return paging(0);
    }

    @GetMapping("/recipe-sort-alph")
    public List<RecipeResponse> sortRecipesAlph() {

        cachedDataExtended = recipeService.sortRecipesAlph(cachedDataExtended);
        return paging(0);
    }

    @GetMapping("/recipe-sort-rate")
    public List<RecipeResponse> sortRecipesRate() {

        cachedDataExtended = recipeService.sortRecipesRate(cachedDataExtended);
        return paging(0);
    }

    @GetMapping("/recipe-sort-ingCount")
    public List<RecipeResponse> sortRecipesIngCount() {

        cachedDataExtended = recipeService.sortRecipesIngCount(cachedDataExtended);
        return paging(0);

    }
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
    public List<RecipeResponse> BasicSearch(@RequestParam String targetWord,Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        cachedData = recipeService.BasicSearch(targetWord,currentUser);
        updateCachedData(currentUser);
        return paging(0);
    }
    @GetMapping("/ingredient-based-search")
    public List<Recipe> IngredientBasedSearch(String TargetIngredients) {
        String[] ingredientsArray = TargetIngredients.split(",");
        List<String> ingredientList = Arrays.asList(ingredientsArray);
        return recipeService.IngredientBasedSearch(ingredientList);
    }



}
