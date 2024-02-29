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
        UserRecipes userRecipe = userRecipeRepository.findById(userRecipeId).orElse(null);
        if (userRecipe == null) {
            return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
        }
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

        if (ratesRepository.findByIdRecipeId(id) != null)
        {
            return ratesRepository.findByIdRecipeId(id);
        }
       return 0;
    }

    public List<RateResponse> getOneUserRatesRecipe(User currentUser) {
        List<Rates>userRates = ratesRepository.findByUserAndRecipeIsNotNull(currentUser);
        List<RateResponse> rateResponseList = new ArrayList<>();
        for (Rates oneRate:userRates) {
            Long recipeId = oneRate.getRecipe().getId();
            int rate = oneRate.getRate();
            RateResponse response = new RateResponse(recipeId,rate);
            rateResponseList.add(response);
        }
        return rateResponseList;
    }

    public List<RateResponse> getOneUserRatesUserRecipe(User currentUser) {
        List<Rates>userRates = ratesRepository.findByUserAndUserRecipesIsNotNull(currentUser);
        List<RateResponse> rateResponseList = new ArrayList<>();
        for (Rates oneRate:userRates) {
            Long recipeId = oneRate.getRecipe().getId();
            int rate = oneRate.getRate();
            RateResponse response = new RateResponse(recipeId,rate);
            rateResponseList.add(response);
        }
        return rateResponseList;
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
