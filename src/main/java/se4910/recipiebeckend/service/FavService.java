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
import se4910.recipiebeckend.response.UserFavoritesResponse;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FavService {

    FavoritesRepository favoritesRepository;

    RecipeRepository recipeRepository;

    UserRecipeRepository userRecipeRepository;

    public List<String> getIngredientsList(Recipe recipe)
    {
        return Arrays.asList(recipe.getIngredients().split(","));
    }

    public List<String> getIngredientsListUR(UserRecipes recipe)
    {
        return Arrays.asList(recipe.getIngredients().split(","));
    }


    public ResponseEntity<List<UserFavoritesResponse>> getOneUserFavorites(User currentUser) {
        List<Favorites> favoriteRecipes = favoritesRepository.findByUserAndRecipeIsNotNull(currentUser);
        List<Favorites> favoriteUserRecipes = favoritesRepository.findByUserAndUserRecipesIsNotNull(currentUser);

        List<Favorites> combinedList = new ArrayList<>();
        combinedList.addAll(favoriteRecipes);
        combinedList.addAll(favoriteUserRecipes);

        List<UserFavoritesResponse> userFavoritesResponses = new ArrayList<>();

        for (Favorites favorite : combinedList) {
            if (favorite.getRecipe() != null) {
                int ingCount = getIngredientsList(favorite.getRecipe()).size();
                userFavoritesResponses.add(new UserFavoritesResponse(favorite,ingCount));
            } else if (favorite.getUserRecipes() != null) {
                int ingCount = getIngredientsListUR(favorite.getUserRecipes()).size();
                userFavoritesResponses.add(new UserFavoritesResponse(favorite.getUserRecipes(),ingCount));
            }
        }

        return ResponseEntity.ok(userFavoritesResponses);
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
