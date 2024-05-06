package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.Rates;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatesRepository extends JpaRepository<Rates,Long>{


    @Override
    Optional<Rates> findById(Long aLong);

   @Query("SELECT AVG(r.rate) FROM rates r WHERE r.recipe.id = :recipeId")
    Double findByIdRecipeId(@Param("recipeId") Long recipeId);

   @Query("SELECT AVG(r.rate) FROM rates r WHERE r.userRecipes.id = :userRecipeId")
   Double findByIdUserRecipesId(@Param("userRecipeId") Long userRecipeId);

    List<Rates> findByUserAndRecipeIsNotNull(User user);

    List<Rates> findByUserAndUserRecipesIsNotNull(User user);

    Optional<Rates>  findByRecipeAndUser(Recipe recipe, User user);

    Optional<Rates>  findByUserRecipesAndUser(UserRecipes userRecipes, User user);

    @Query("SELECT r.recipe FROM rates r GROUP BY r.recipe.id ORDER BY AVG(r.rate) DESC LIMIT 5")
    List<Recipe> findTop5RateRecipe();

    @Query("SELECT r.userRecipes FROM rates r GROUP BY r.userRecipes.id ORDER BY AVG(r.rate) DESC LIMIT 5")
    List<UserRecipes> findTop5RateUserRecipe();
}
