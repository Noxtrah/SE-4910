package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.repository.*;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RecipeService {

    RecipeRepository recipeRepository;
    RatesService ratesService;
    MealRepository mealRepository;
    FavService favService;
    UserRecipeRepository userRecipeRepository;
    UserRepository userRepository;

    FavoritesRepository favoritesRepository;
    public List<Recipe> getAllRecipes()
    {
        List<Recipe> recipes = recipeRepository.findAll();
        if (recipes != null) {

            return  recipes;
        } else
        {
            return Collections.emptyList();
        }

    }

    public ResponseEntity<String> createRecipe(RecipeRequest recipeRequest)
    {

        if (recipeRequest.getIngredients() == null || recipeRequest.getTitle() == null)
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Recipe recipe = new Recipe();
        recipe.setMeal(mealConverter(recipeRequest.getMeal()));
        recipe.setCuisine(recipeRequest.getCuisine());
        recipe.setTitle(recipeRequest.getTitle());
        recipe.setIngredients(recipeRequest.getIngredients());
        recipe.setDescription(recipeRequest.getDescription());
        recipe.setPreparationTime(recipeRequest.getPreparationTime());
        recipe.setPhotoPath(recipeRequest.getPhotoPath());
        recipeRepository.save(recipe);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    private List<Meal> mealConverter(String meal)
    {
        String[] mealNames = {};
        List<Meal> meals = new ArrayList<>();
        if(meal.contains(","))
        {
            mealNames = meal.split(",");


            for (String mealName : mealNames) {
                Optional<Meal> optionalMeal = Optional.ofNullable(mealRepository.findByMealName(mealName.trim()));

                optionalMeal.ifPresent(meals::add);

            }
        }
        else {

            Meal newMeal = mealRepository.findByMealName(meal);
            if (newMeal != null)
            {
                meals.add(newMeal);
            }
        }
        return meals;
    }

    public ResponseEntity<String> updateRecipe(RecipeRequest recipeRequest)
    {
        Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeRequest.getId());
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();

            if (recipeRequest.getTitle() != null) {
                recipe.setTitle(recipeRequest.getTitle());
            }
            if (recipeRequest.getIngredients() != null) {
                recipe.setIngredients(recipeRequest.getIngredients());
            }
            if (recipeRequest.getDescription() != null) {
                recipe.setDescription(recipeRequest.getDescription());
            }
            if (recipeRequest.getCuisine() != null) {
                recipe.setCuisine(recipeRequest.getCuisine());
            }
            if (recipeRequest.getMeal() != null) {
                recipe.setMeal(mealConverter(recipeRequest.getMeal()));
            }
            if (recipeRequest.getPreparationTime() > 0) {
                recipe.setPreparationTime(recipeRequest.getPreparationTime());
            }
            if (recipeRequest.getPhotoPath() != null) {
                recipe.setPhotoPath(recipeRequest.getPhotoPath());
            }

            recipeRepository.save(recipe);

            return ResponseEntity.ok("Recipe updated successfully!" );

        }
        else {
            return ResponseEntity.notFound().build(); // Eğer reçete bulunamazsa 404 döndür
        }
    }

    public ResponseEntity<String> deleteRecipe(Long id)
    {
        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();
            recipeRepository.delete(recipe);
            return ResponseEntity.ok("Recipe with ID: " + id + " deleted successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public List<Recipe> getRecipesByMeal(String mealType)
    {
        Meal meal = mealRepository.findByMealName(mealType);

        return recipeRepository.findByMeal(meal);

    }

    public List<Recipe> getRecipesByCuisine(String cuisine)
    {
        //Baş harfi büyük yap
        cuisine = cuisine.substring(0, 1).toUpperCase() + cuisine.substring(1).toLowerCase();
        return recipeRepository.findByCuisine(cuisine);
    }

    public Recipe getRecipeByID(long id) {
        Optional<Recipe> recipe = recipeRepository.findById(id);
        return recipe.orElse(null);
    }

    public List<Recipe> sortRecipesPrepTime() {

        List<Recipe> recipes = recipeRepository.findAll();

        // Sorting recipes based on preparation time
        recipes.sort(Comparator.comparingInt(Recipe::getPreparationTime));

        return recipes;

    }

    public List<Recipe> sortRecipesAlph() {

        List<Recipe> recipes = recipeRepository.findAll();

        // Sorting recipes alphabetically by name
        recipes.sort(Comparator.comparing(Recipe::getTitle));

        return recipes;
    }

    public List<String> getIngredientsList(Recipe recipe)
    {
        return Arrays.asList(recipe.getIngredients().split(","));
    }
    public List<Recipe> sortRecipesIngCount() {

        List<Recipe> recipes = recipeRepository.findAll();

        Collections.sort(recipes, Comparator.comparingInt(recipe -> getIngredientsList(recipe).size()));
      //  Collections.reverse(recipes);
        return recipes;
    }

    public List<Recipe> sortRecipesRate() {

        List<Recipe> sortedList = new ArrayList<>();
        List<Long> ids = recipeRepository.findRecipesOrderByAvgRatings();

        for (Long id : ids) {
            Optional<Recipe> optionalRecipe = recipeRepository.findById(id);

            if (optionalRecipe.isPresent()) {
                sortedList.add(optionalRecipe.get());
            }

        }

        return sortedList;
    }

    public ResponseEntity<List<String>> getRecipeWithRates()
    {

        List<String> recipeInfoRates = new ArrayList<>();

        List<Recipe> recipes = recipeRepository.findAll();

        for (Recipe recipe : recipes) {

            double rate = ratesService.GetAvgRatesByRecipeId(recipe.getId());
                String rateString = String.valueOf(rate);
                String str = recipe.getTitle() + "(" + recipe.getId() + ") Rate: " + rateString;
                recipeInfoRates.add(str);


        }
        return ResponseEntity.ok(recipeInfoRates);


    }

    public List<UserRecipeResponse> getPublishedUserRecipes()
    {
        List<UserRecipes> userRecipesList = userRecipeRepository.findByIsPublishTrue();

        return userRecipesList.stream()
                .map(UserRecipeResponse::new) // Using constructor reference to create UserRecipeResponse
                .collect(Collectors.toList());

    }

    public List<UserRecipes> publishedRecipesOneUser(String username) {

        User user = userRepository.findUserByUsername(username);

        return userRecipeRepository.findByUserAndIsPublishTrue(user);

    }



    public List<Recipe> IngredientBasedSearch(List<String> targetIngredients) {
        List<Recipe> recipes = null;
        for (String ingredient : targetIngredients) {
            List<Recipe> recipesContainingIngredient = recipeRepository.findByIngredientsContaining(ingredient);
            if (recipes == null) {
                recipes = recipesContainingIngredient;
            } else {
                recipes.retainAll(recipesContainingIngredient);
            }
        }
        return recipes;
    }

    public List<Recipe> BasicSearch(String targetWord) {

        List<Recipe>foundRecipes = recipeRepository.searchInTitleAndDescription(targetWord);
        if (foundRecipes != null);
        {
              return foundRecipes;
        }

    }

    public void lowerRecipe()
    {
        recipeRepository.lowerIngredients();
    }

    public List<RecipeResponse> getCustomDataDashboard(User currentUser)
    {
        List<RecipeResponse> customData = new ArrayList<>();
        List<Recipe> allRecipes = recipeRepository.findAll();
        Set<Long> likedRecipeIds = favService.getUserLikedRecipeIds(currentUser);
        Map<Long, Integer> userRatesByRecipeId = ratesService.getRatesByRecipeIds(currentUser, allRecipes);

        for (Recipe recipe : allRecipes) {
            boolean isLiked = likedRecipeIds.contains(recipe.getId());
            int rate = userRatesByRecipeId.getOrDefault(recipe.getId(), 0);
            double avgRate = ratesService.GetAvgRatesByRecipeId(recipe.getId());

            customData.add(new RecipeResponse(recipe, isLiked, rate, avgRate));
        }

        return customData;
    }

    public List<UserRecipeResponseFull> getCustomDataUserDashboard(User currentUser) {

        List<UserRecipeResponseFull> customData = new ArrayList<>();
        List<UserRecipes> allRecipes = userRecipeRepository.findByIsPublishTrue();
        Set<Long> likedRecipeIds = favService.getUserLikedUserRecipeIds(currentUser);
        Map<Long, Integer> userRatesByRecipeId = ratesService.getRatesByUserRecipeIds(currentUser, allRecipes);

        for (UserRecipes userRecipes : allRecipes) {
            boolean isLiked = likedRecipeIds.contains(userRecipes.getId());
            int rate = userRatesByRecipeId.getOrDefault(userRecipes.getId(), 0);
            double avgRate = ratesService.GetAvgRatesByRecipeId(userRecipes.getId());

            customData.add(new UserRecipeResponseFull(userRecipes, isLiked, rate, avgRate));
        }

        return customData;
    }
}
