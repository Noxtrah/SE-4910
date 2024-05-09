package se4910.recipiebeckend.service;

import com.azure.storage.blob.BlobServiceClient;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import se4910.recipiebeckend.controller.ParentController;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.repository.*;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.*;
import java.util.UUID;
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
    ParentController parentController;




    public List<Recipe> getAllRecipesBasic()
    {
        List<Recipe> recipes = recipeRepository.findAll();
        if (recipes != null) {

            return  recipes;
        } else
        {
            return Collections.emptyList();
        }

    }

   /* public ResponseEntity<String> createRecipe(RecipeRequest recipeRequest)
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

    */

    public Recipe getRecipeByID(long id) {
        Optional<Recipe> recipe = recipeRepository.findById(id);
        return recipe.orElse(null);
    }

    public ResponseEntity<String> createRecipeBlob(RecipeRequest recipeRequest) {
        if (recipeRequest.getIngredients() == null || recipeRequest.getTitle() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {

            String photoUrlString = parentController.uploadPhotoToBlobStorage(recipeRequest.getPhotoPath());
            // Save recipe details to database
            Recipe recipe = new Recipe();
            recipe.setMeal(mealConverter(recipeRequest.getMeal()));
            recipe.setCuisine(recipeRequest.getCuisine());
            recipe.setTitle(recipeRequest.getTitle());
            recipe.setIngredients(recipeRequest.getIngredients());
            recipe.setDescription(recipeRequest.getDescription());
            recipe.setPreparationTime(recipeRequest.getPreparationTime());
            recipe.setPhotoPath(photoUrlString);
            recipeRepository.save(recipe);

            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<Recipe> getAllRecipes(){

        return recipeRepository.findAll();
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

                System.out.println("photo update işlemi");
                // Blob depolama işlemini gerçekleştir ve elde edilen URL'i al
                String photoUrl = parentController.uploadPhotoToBlobStorage(recipeRequest.getPhotoPath());
                // Elde edilen URL'i photoPath alanına ata
                recipe.setPhotoPath(photoUrl);
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

    public List<Recipe> getRecipesByCuisine(String cuisine) {

        cuisine = cuisine.substring(0, 1).toUpperCase() + cuisine.substring(1).toLowerCase();
        return recipeRepository.findByCuisine(cuisine);

    }

    public List<RecipeResponse> fillResponse( List<Recipe> filteredRecipes, User currentUser) {

        List<RecipeResponse> recipeResponses = new ArrayList<>();

        for (Recipe recipe : filteredRecipes) {
            boolean isLiked = favService.checkFav(currentUser,recipe);
            int rate = ratesService.getRateByRecipeAndUser(currentUser, recipe);
            double avgRate = ratesService.GetAvgRatesByRecipeId(recipe.getId());

            recipeResponses.add(new RecipeResponse(recipe,isLiked,rate,avgRate));
        }
        return recipeResponses;
    }

    public List<RecipeResponse> fillResponseDefaults( List<Recipe> filteredRecipes) {

        List<RecipeResponse> recipeResponses = new ArrayList<>();

        for (Recipe recipe : filteredRecipes) {
            boolean isLiked = false;
            //  int rate = userRatesByRecipeId.getOrDefault(recipe.getId(), 0);
            int rate = 0;
            double avgRate = ratesService.GetAvgRatesByRecipeId(recipe.getId());

            recipeResponses.add(new RecipeResponse(recipe, isLiked, rate, avgRate));
        }
        return recipeResponses;
    }



    public List<String> getIngredientsList(Recipe recipe)
    {
        return Arrays.asList(recipe.getIngredients().split(","));
    }

    public List<RecipeResponse> sortRecipesIngCount(List<RecipeResponse> recipes) {
        recipes.sort(Comparator.comparingInt(r -> getIngredientsList(r.getRecipe()).size()));
        return recipes;
    }


    public List<RecipeResponse> sortRecipesAlph(List<RecipeResponse> recipes) {
        recipes.sort(Comparator.comparing(r -> r.getRecipe().getTitle(), String.CASE_INSENSITIVE_ORDER));
        return recipes;
    }

    public List<RecipeResponse> sortRecipesRate(List<RecipeResponse> recipes) {
        recipes.sort(Comparator.comparingDouble(RecipeResponse::getAvgRate).reversed());
        return recipes;
    }

    public List<RecipeResponse> sortRecipesPrepTime(List<RecipeResponse> recipes) {
        recipes.sort(Comparator.comparingInt(r -> r.getRecipe().getPreparationTime()));
        return recipes;
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

    public List<Recipe> BasicSearch(String targetWord,User currentUser) {
        return recipeRepository.searchInTitle(targetWord);
    }

    public void lowerRecipe()
    {
        recipeRepository.lowerIngredients();
    }



    public List<RecipeResponse> doPaging(List<RecipeResponse> cachedDataExtended, int key)
    {
        int pageSize = 6;
        int fromIndex = key * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, cachedDataExtended.size());
        if (fromIndex >= cachedDataExtended.size()) {

            return Collections.emptyList();
        }
        return cachedDataExtended.subList(fromIndex, toIndex);
    }
}
