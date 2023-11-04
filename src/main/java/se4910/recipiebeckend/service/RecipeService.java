package se4910.recipiebeckend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.repository.RatesRepository;
import se4910.recipiebeckend.repository.RecipeRepository;
import se4910.recipiebeckend.response.RecipeResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    RecipeRepository recipeRepository;
    @Autowired
    RatesService ratesService;

    @Autowired
    RatesRepository ratesRepository;
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
}
