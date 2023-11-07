package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.Recipe;

import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long>
{
    @Override
    Optional<Recipe> findById(Long recipeId);
}
