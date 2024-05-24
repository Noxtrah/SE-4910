package se4910.recipiebeckend.service;

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
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    RecipeRepository recipeRepository;
    RatesService ratesService;
    public List<Recipe> getAllRecipes()
    {
        return recipeRepository.findAll();
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
        recipe.setPhotoData(recipeRequest.getPhotoData());
        recipeRepository.save(recipe);
        return  new ResponseEntity<>(HttpStatus.CREATED);
    }
}
