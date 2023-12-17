package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.entity.Recipe;

import java.util.List;
import java.util.Optional;


@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long>
{


    Optional<Recipe> findById(Long recipeId);

    List<Recipe> findAll();

    List<Recipe> findByMeal(Meal meal);

}
