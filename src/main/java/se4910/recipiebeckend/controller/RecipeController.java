package se4910.recipiebeckend.controller;

import jakarta.persistence.Cacheable;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.RecipeDetailResponse;
import se4910.recipiebeckend.response.RecipeResponse;
import se4910.recipiebeckend.service.RecipeService;
import se4910.recipiebeckend.service.UserService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@RestController
@RequestMapping(value = "/recipes", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RecipeController extends ParentController{

    @Autowired
    RecipeService recipeService;


    @Autowired
    UserService userService;


    private List<Recipe> cachedData = new ArrayList<>();

    private List<RecipeResponse> cachedDataExtended = new ArrayList<>();


    public List<RecipeResponse> paging( @RequestParam(name = "key") int key)
    {
        return  recipeService.doPaging(cachedDataExtended,key);
    }

    private void updateCachedData(User currentUser) {
        if (currentUser != null) {
            cachedDataExtended = recipeService.fillResponse(getCachedData(), currentUser);
        } else {
            cachedDataExtended = recipeService.fillResponseDefaults(getCachedData());
        }
    }

    private List<RecipeResponse> updateData(User currentUser, List<Recipe> recipes) {
        if (currentUser != null) {
            cachedDataExtended = recipeService.fillResponse(recipes, currentUser);
        } else {
            cachedDataExtended = recipeService.fillResponseDefaults(recipes);
        }
        return cachedDataExtended;
    }


    //*************************************************************************
    @GetMapping("/home")
    public List<RecipeResponse> home(@RequestParam(name = "key", defaultValue = "0") int key, Authentication authentication)
    {
            User currentUser = getCurrentUser(authentication);
            cachedData = recipeService.getAllRecipes();
            setCachedData(cachedData);
            updateCachedData(currentUser);
            return paging(key);
    }

 /*   @GetMapping("/home2")
    public List<RecipeResponse> home2(@RequestParam(name = "key", defaultValue = "0") int key, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        Page<Recipe> recipePage = recipeService.paginateRecipes(key);
        List<Recipe> recipes = recipePage.getContent();
        return  updateData(currentUser, recipes);

    }
*/
    @GetMapping("/get-max-page")
    public int getMaxPage()
    {
       return recipeService.getMaxPage();
    }

    @GetMapping("/all-recipes")
    public List<Recipe> getAllRecipes()
    {
        return recipeService.getAllRecipesBasic();
    }

    @GetMapping("/recipe-by-id")
    public RecipeDetailResponse getRecipeById(@RequestParam long id, Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return recipeService.getRecipeDetails(id,currentUser);
        }
        return recipeService.getRecipeDetailsSimple(id);

    }


    @PostMapping("/create-recipe-blob")
    public ResponseEntity<String> createRecipeBlob( @ModelAttribute RecipeRequest recipeRequest)
    {
        return recipeService.createRecipeBlob(recipeRequest);
    }
    @PutMapping("/update-recipe")
    public ResponseEntity<String> updateRecipebyID(@ModelAttribute RecipeRequest recipeRequest)
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
    public List<RecipeResponse> getRecipesByCuisine(@RequestParam (name = "key", defaultValue = "0") int key, String cuisine, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        cachedData = recipeService.getRecipesByCuisine(cuisine);
        updateCachedData(currentUser);
        return paging(key); // Assuming page 0 as initial page
    }

    @GetMapping("/getRecipesByCuisine2")
    public List<RecipeResponse> getRecipesByCuisine2(@RequestParam(name = "key", defaultValue = "0") int key, @RequestParam(name = "cuisine") String cuisine,
                                                    Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        Page<Recipe> recipePage = recipeService.getRecipesByCuisine2(cuisine, key);
        List<Recipe> recipes = recipePage.getContent();
        return updateData(currentUser, recipes);
    }


    @GetMapping("/recipe-sort-preptime")
    public List<RecipeResponse> sortRecipesPrepTime(@RequestParam(name = "key", defaultValue = "0") int key) {
        cachedDataExtended = recipeService.sortRecipesPrepTime(cachedDataExtended);
        return paging(key);
    }

    @GetMapping("/recipe-sort-alph")
    public List<RecipeResponse> sortRecipesAlph(@RequestParam(name = "key", defaultValue = "0") int key) {

        cachedDataExtended = recipeService.sortRecipesAlph(cachedDataExtended);
        return paging(key);
    }

    @GetMapping("/recipe-sort-alph2")
    public List<RecipeResponse> sortRecipesAlph(@RequestParam(name = "key", defaultValue = "0") int key, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        Page<Recipe> recipePage = recipeService.getSortedRecipes2(key);
        List<Recipe> recipes = recipePage.getContent();
        return updateData(currentUser, recipes);
    }


    @GetMapping("/recipe-sort-rate")
    public List<RecipeResponse> sortRecipesRate(@RequestParam(name = "key", defaultValue = "0") int key) {

        cachedDataExtended = recipeService.sortRecipesRate(cachedDataExtended);
        return paging(key);
    }

    @GetMapping("/recipe-sort-rate2")
    public List<RecipeResponse> sortRecipesRate2(@RequestParam(name = "key", defaultValue = "0") int key, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<Recipe> allRecipes = recipeService.getAllRecipes();
        List<RecipeResponse> recipeResponses = updateData(currentUser, allRecipes);
        recipeResponses = recipeService.getSortedRecipesByRate(recipeResponses,key);
       return recipeResponses;
    }

    @GetMapping("/recipe-sort-ingCount")
    public List<RecipeResponse> sortRecipesIngCount(@RequestParam(name = "key", defaultValue = "0") int key) {

        cachedDataExtended = recipeService.sortRecipesIngCount(cachedDataExtended);
        return paging(key);
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
