package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Favorites;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.FavoritesRepository;
import se4910.recipiebeckend.repository.RecipeRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FavService {

    FavoritesRepository favoritesRepository;

    RecipeRepository recipeRepository;
    public List<Recipe> getOneUserFavorites(User currentUser)
    {
        List<Favorites> favorites = favoritesRepository.findAllByUser(currentUser);

        return favorites.stream()
                .map(Favorites::getRecipe)
                .collect(Collectors.toList());

    }

    public ResponseEntity<?> giveOneLike(long recipeId, User currentUser) {

        try {

            Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeId);
            optionalRecipe.ifPresent(recipe -> {
                Favorites favorite = new Favorites();
                favorite.setUser(currentUser);
                favorite.setRecipe(recipe);
                favoritesRepository.save(favorite);
            });

            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();

        }
        return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
    }

    public List<Long> getOneUserFavoritesId(User currentUser)
    {
        List<Favorites> favorites = favoritesRepository.findAllByUser(currentUser);

        List<Recipe> recipes = favorites.stream()
                .map(Favorites::getRecipe)
                .toList();

        return recipes.stream().map(Recipe::getId).collect(Collectors.toList());
    }

    public ResponseEntity<?> unlike(long recipeId, User currentUser)
    {
        try {
            Optional<Recipe> recipe = recipeRepository.findById(recipeId);
            Favorites favorites = favoritesRepository.findByRecipe(recipe.get());
            favoritesRepository.delete(favorites);
            return new ResponseEntity<>(recipe.get().getTitle() + "unliked" ,HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }
}
