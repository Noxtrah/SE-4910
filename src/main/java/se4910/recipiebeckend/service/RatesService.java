package se4910.recipiebeckend.service;

import org.springframework.stereotype.Service;
import se4910.recipiebeckend.repository.RatesRepository;

@Service
public class RatesService
{

    RatesRepository ratesRepository;
      public double GetOneRateByRecipeId(long RecipeId){

          return ratesRepository.findByIdRecipeId(RecipeId);

      }
}
