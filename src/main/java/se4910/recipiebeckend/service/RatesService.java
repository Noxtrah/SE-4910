package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Rates;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.RatesRepository;
import se4910.recipiebeckend.repository.RecipeRepository;
import se4910.recipiebeckend.response.RateResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RatesService
{
    RatesRepository ratesRepository;

    RecipeRepository recipeRepository;


    public ResponseEntity<?> giveOneRate(int rate,long recipeId, User currentUser)
    {
        Rates rates = new Rates();

        Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeId);
        Recipe recipe = optionalRecipe.get();
        if (ratesRepository.findByRecipeAndUser(recipe, currentUser) == null) {

            rates.setRecipe(recipe);
            rates.setRate(rate);
            rates.setUser(currentUser);

            String msg = "new rate added for " + currentUser.getUsername();
            return new ResponseEntity(msg, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("rate already given" ,HttpStatus.BAD_REQUEST);
        }

    }


    public double GetRatesByRecipeId(Long id)
    {
        return ratesRepository.findByIdRecipeId(id);
    }

    // bu fonksiyon current usera göre ratingleri alır ve recipe ID, rate döndürür.
    public List<RateResponse> getOneUserRates(User currentUser)
    {
        List<Rates>userRates = ratesRepository.findByUser(currentUser);
        List<RateResponse> rateResponseList = new ArrayList<>();
        for (Rates oneRate:userRates) {
            Long recipeId = oneRate.getRecipe().getId();
            int rate = oneRate.getRate();
            RateResponse response = new RateResponse(recipeId,rate);
            rateResponseList.add(response);
        }
        return rateResponseList;
    }
}
