package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Rates;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.RatesRepository;
import se4910.recipiebeckend.repository.RecipeRepository;
import se4910.recipiebeckend.response.OneUserRates;

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

    public List<OneUserRates> getOneUserRates(User currentUser)
    {
        List<Rates>userRates = ratesRepository.findByUser(currentUser);

        List<OneUserRates> ourList = new ArrayList<>();
        for (Rates oneRate:userRates) {
            Recipe recipe = oneRate.getRecipe();
            int rate = oneRate.getRate();
            OneUserRates oneUserRates = new OneUserRates(recipe,rate);
            ourList.add(oneUserRates);

        }

        return ourList;
    }
}
