package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.*;
import se4910.recipiebeckend.repository.RatesRepository;
import se4910.recipiebeckend.repository.RecipeRepository;
import se4910.recipiebeckend.repository.UserRecipeRepository;
import se4910.recipiebeckend.response.RateResponse;

import java.text.DecimalFormat;
import java.util.*;

@Service
@AllArgsConstructor
public class RatesService
{
    RatesRepository ratesRepository;

    RecipeRepository recipeRepository;


    UserRecipeRepository userRecipeRepository;

    public ResponseEntity<String> giveOneRate(int rate,long recipeId, User currentUser)
    {

        Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeId);
        if (optionalRecipe.isEmpty()) {
            return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
        }

        Recipe recipe = optionalRecipe.get();
        Rates existingRates = ratesRepository.findByRecipeAndUser(recipe, currentUser);
        if (existingRates == null) {
            Rates newRates = new Rates();
            newRates.setRecipe(recipe);
            newRates.setRate(rate);
            newRates.setUser(currentUser);
            ratesRepository.save(newRates);
            return new ResponseEntity<>("New rate added for " + currentUser.getUsername() + " - " + recipe.getTitle(), HttpStatus.OK);
        } else {
            existingRates.setRate(rate);
            ratesRepository.save(existingRates);
            return new ResponseEntity<>("Rate updated for " + currentUser.getUsername() + " - " + recipe.getTitle(), HttpStatus.OK);
        }

    }


    public ResponseEntity<String> giveOneRateUserRecipe(int rate, long userRecipeId, User currentUser)
    {
        Optional<UserRecipes> userRecipesOptional = userRecipeRepository.findById(userRecipeId);
        if (userRecipesOptional.isEmpty()) {
            return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
        }
        UserRecipes userRecipe = userRecipesOptional.get();
        Rates existingRates = ratesRepository.findByUserRecipesAndUser(userRecipe, currentUser);
        if (existingRates == null) {
            Rates newRates = new Rates();
            newRates.setUserRecipes(userRecipe);
            newRates.setRate(rate);
            newRates.setUser(currentUser);
            ratesRepository.save(newRates);
            return new ResponseEntity<>("New rate added for " + currentUser.getUsername() + " - " + userRecipe.getTitle(), HttpStatus.OK);
        } else {
            existingRates.setRate(rate);
            ratesRepository.save(existingRates);
            return new ResponseEntity<>("Rate updated for " + currentUser.getUsername() + " - " + userRecipe.getTitle(), HttpStatus.OK);
        }


    }


    public double GetAvgRatesByRecipeId(Long id) {
        Double avgRate = ratesRepository.findByIdRecipeId(id);
        if (avgRate != null) {
            DecimalFormat df = new DecimalFormat("#,#");
            return Double.parseDouble(df.format(avgRate));
        }
        return 0;
    }



    public double GetAvgRatesByUserRecipeId(Long id) {

        if (ratesRepository.findByIdUserRecipesId(id) != null)
        {
            DecimalFormat df = new DecimalFormat("#.#");
            return Double.parseDouble(df.format(ratesRepository.findByIdUserRecipesId(id)));
        }
        return 0;

    }

    public Map<Long, Integer> getRatesByRecipeIds(User currentUser, List<Recipe> allRecipes)
    {
        Map<Long, Integer> ratesByRecipeIds = new HashMap<>();

        List<Rates> ratesList = ratesRepository.findByUserAndRecipeIsNotNull(currentUser);
        // Her bir puanı Map'e ekle
        for (Rates rate : ratesList) {
            ratesByRecipeIds.put(rate.getRecipe().getId(), rate.getRate());
        }
        return ratesByRecipeIds;

    }

    public int getRateByRecipeAndUser(User currentUser, Recipe recipe)
    {
       return  ratesRepository.findByRecipeAndUser(recipe,currentUser).getRate();
    }

    public Map<Long, Integer> getRatesByUserRecipeIds(User currentUser, List<UserRecipes> allRecipes)
    {

        Map<Long, Integer> ratesByRecipeIds = new HashMap<>();

        List<Rates> ratesList = ratesRepository.findByUserAndUserRecipesIsNotNull(currentUser);
        // Her bir puanı Map'e ekle
        for (Rates rate : ratesList) {
            ratesByRecipeIds.put(rate.getRecipe().getId(), rate.getRate());
        }
        return ratesByRecipeIds;

    }

}
