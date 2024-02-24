package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.Favorites;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;


import java.util.List;
import java.util.Optional;

@Repository

public  interface FavoritesRepository extends JpaRepository<Favorites, Long>
{
    @Override
    Optional<Favorites> findById(Long favID);

    Favorites findByRecipe(Recipe recipe);

    Favorites findByUserRecipesAndUser(UserRecipes userRecipes,User user);

    Favorites findByRecipeAndUser(Recipe recipe, User user);

    List<Favorites> findByUserAndRecipeIsNotNull(User user);

    List<Favorites> findByUserAndUserRecipesIsNotNull(User user);

    @Override
    List<Favorites> findAll();

    List<Favorites> findAllByUser(User user);



}
