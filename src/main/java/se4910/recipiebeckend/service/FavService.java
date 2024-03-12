package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Favorites;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.repository.FavoritesRepository;
import se4910.recipiebeckend.repository.RecipeRepository;
import se4910.recipiebeckend.repository.UserRecipeRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FavService {

    FavoritesRepository favoritesRepository;

    RecipeRepository recipeRepository;

    UserRecipeRepository userRecipeRepository;
    public ResponseEntity<List<Object>> getOneUserFavorites(User currentUser)
    {
        List<Favorites> favoriteRecipes = favoritesRepository.findByUserAndRecipeIsNotNull(currentUser);
        List<Favorites> favoriteUserRecipes = favoritesRepository.findByUserAndUserRecipesIsNotNull(currentUser);


        List<Recipe> recipes = favoriteRecipes.stream()
                .map(Favorites::getRecipe)
                .toList();

        List<UserRecipes> userRecipes = favoriteUserRecipes.stream()
                .map(Favorites::getUserRecipes)
                .toList();

        List<Object> combinedList = new ArrayList<>();
        combinedList.addAll(recipes);
        combinedList.addAll(userRecipes);

        return ResponseEntity.ok(combinedList);

    }

    public ResponseEntity<String> giveOneLike(long recipeId, User currentUser) {

        Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeId);
        if (optionalRecipe.isEmpty()) {
            return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
        }

        Recipe recipe = optionalRecipe.get();
        Favorites existingFav = favoritesRepository.findByRecipeAndUser(recipe, currentUser);
        if (existingFav == null) {
            Favorites favorite = new Favorites();
            favorite.setUser(currentUser);
            favorite.setRecipe(recipe);
            favoritesRepository.save(favorite);
            return new ResponseEntity<>(recipe.getTitle() + " liked", HttpStatus.OK);
        } else {
            favoritesRepository.delete(existingFav);
            return new ResponseEntity<>(recipe.getTitle() + " unliked", HttpStatus.OK);
        }
    }

    public ResponseEntity<String> giveOneLikeUserRecipes(long recipeId, User currentUser)
    {

        Optional<UserRecipes> optionalRecipe = userRecipeRepository.findById(recipeId);
        if (optionalRecipe.isEmpty()) {
            return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
        }

        UserRecipes userRecipes = optionalRecipe.get();
        Favorites existingFav = favoritesRepository.findByUserRecipesAndUser(userRecipes, currentUser);
        if (existingFav == null) {
            Favorites favorite = new Favorites();
            favorite.setUser(currentUser);
            favorite.setUserRecipes(userRecipes);
            favoritesRepository.save(favorite);
            return new ResponseEntity<>(userRecipes.getTitle() + " liked", HttpStatus.OK);
        } else {
            favoritesRepository.delete(existingFav);
            return new ResponseEntity<>(userRecipes.getTitle() + " unliked", HttpStatus.OK);
        }
    }


    public Set<Long> getUserLikedRecipeIds(User currentUser) {
        List<Favorites> favoriteRecipes = favoritesRepository.findByUserAndRecipeIsNotNull(currentUser);
        return favoriteRecipes.stream()
                .map(favorite -> favorite.getRecipe().getId())
                .collect(Collectors.toSet());
    }

    public Set<Long> getUserLikedUserRecipeIds(User currentUser) {

        List<Favorites> favoriteRecipes = favoritesRepository.findByUserAndUserRecipesIsNotNull(currentUser);
        return favoriteRecipes.stream()
                .map(favorite -> favorite.getRecipe().getId())
                .collect(Collectors.toSet());
    }

    public boolean checkFav(User currentUser, Recipe recipe)
    {
        return favoritesRepository.findByRecipeAndUser(recipe, currentUser) != null;

    }

    public boolean checkFavUserRecipes(User currentUser, UserRecipes userRecipes)
    {
        return favoritesRepository.findByUserRecipesAndUser(userRecipes, currentUser) != null;
    }
}
