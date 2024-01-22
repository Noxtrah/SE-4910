package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.Rates;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatesRepository extends JpaRepository<Rates,Long>{


    @Override
    Optional<Rates> findById(Long aLong);

   @Query("SELECT AVG(r.rate) FROM rates r WHERE r.recipe.id = :recipeId")
    Double findByIdRecipeId(@Param("recipeId") Long recipeId);

    List<Rates> findByUser(User user);

    Rates findByRecipeAndUser(Recipe recipe, User user);
}
