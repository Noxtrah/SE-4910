package se4910.recipiebeckend.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.response.RecipeResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Transactional
@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long>
{


    Optional<Recipe> findById(Long recipeId);

    List<Recipe> findAll();

    List<Recipe> findByMeal(Meal meal);

    List<Recipe> findByCuisine(String cuisine);


    @Query("SELECT rt.recipe.id FROM rates rt GROUP BY rt.recipe.id ORDER BY AVG(rt.rate) DESC")
    List<Long> findRecipesOrderByAvgRatings();


    @Query("SELECT r FROM recipe r WHERE r.title LIKE %:targetWord% OR r.description LIKE %:targetWord%")
    List<Recipe> searchInTitleAndDescription(String targetWord);


    List<Recipe> findAllBy(Pageable pageable);


    @Modifying
    @Query("UPDATE recipe r SET r.ingredients = LOWER(r.ingredients)")
    void lowerIngredients();

  //   @Query("SELECT r FROM Recipe r ORDER BY r.id ASC LIMIT :pageSize OFFSET :offsetValue")
  //  List<Recipe> limit(@Param("pageSize") int pageSize, @Param("offsetValue") int offsetValue);

    List<Recipe> findByIngredientsContaining(String ingredient);

}
