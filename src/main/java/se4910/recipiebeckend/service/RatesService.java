package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.repository.RatesRepository;

@Service
@AllArgsConstructor
public class RatesService
{
    RatesRepository ratesRepository;

      public double GetOneRateByRecipeId(long RecipeId){
          return ratesRepository.findByIdRecipeId(RecipeId);
      }
}
