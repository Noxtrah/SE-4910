package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.repository.RatesRepository;
import se4910.recipiebeckend.repository.RecipeRepository;
import se4910.recipiebeckend.request.RecipeRequest;
import se4910.recipiebeckend.response.RecipeResponse;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RecipeService {

    RecipeRepository recipeRepository;
    RatesService ratesService;
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

    public List<RecipeResponse> getAllRecipesWithRate()
    {

       List<Recipe>recipes = recipeRepository.findAll();

        return recipes.stream().map(recipe -> {
            double rate = ratesService.GetOneRateByRecipeId(recipe.getId());
           return new RecipeResponse(recipe,rate);
       })
               .collect(Collectors.toList());

    }

    public ResponseEntity<String> createRecipe(RecipeRequest recipeRequest)
    {

        if (recipeRequest.getIngredients() == null || recipeRequest.getTitle() == null)
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Recipe recipe = new Recipe();
        recipe.setMeal(recipeRequest.getMeal());
        recipe.setCuisine(recipeRequest.getCuisine());
        recipe.setTitle(recipeRequest.getTitle());
        recipe.setIngredients(recipeRequest.getIngredients());
        recipe.setDescription(recipeRequest.getDescription());
        recipe.setPreparationTime(recipeRequest.getPreparationTime());
        recipe.setPhotoPath(recipeRequest.getPhotoPath());
        recipeRepository.save(recipe);
        return new ResponseEntity<>(HttpStatus.CREATED);
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
                recipe.setMeal(recipeRequest.getMeal());
            }
            if (recipeRequest.getPreparationTime() > 0) {
                recipe.setPreparationTime(recipeRequest.getPreparationTime());
            }
            if (recipeRequest.getPhotoPath() != null) {
                recipe.setPhotoPath(recipeRequest.getPhotoPath());
            }

            recipeRepository.save(recipe);

            return ResponseEntity.ok("Recipe updated successfully!" );

        } else {
            return ResponseEntity.notFound().build(); // Eğer reçete bulunamazsa 404 döndür
        }
    }
}
