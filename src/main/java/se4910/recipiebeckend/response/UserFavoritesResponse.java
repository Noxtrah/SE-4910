package se4910.recipiebeckend.response;


import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.Favorites;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;

@Setter
@Getter
public class UserFavoritesResponse {

    long id;
    String title;
    int ingredientCount;
    String description;
    private int preparationTime;
    String photoPath;
    String userRecipePhoto;


    public UserFavoritesResponse(Favorites favorites, int ingredientCount) {
        Recipe recipe = favorites.getRecipe();
        this.id = favorites.getId();
        this.title = recipe.getTitle();
        this.ingredientCount = ingredientCount;
        this.description = recipe.getDescription();
        this.preparationTime = recipe.getPreparationTime();
        this.photoPath = recipe.getPhotoPath();
    }

    public UserFavoritesResponse(UserRecipes userRecipe, int ingredientCount) {
        this.id = userRecipe.getId();
        this.title = userRecipe.getTitle();
        this.ingredientCount = ingredientCount;
        this.description = userRecipe.getDescription();
        this.preparationTime = userRecipe.getPreparationTime();
        this.userRecipePhoto = userRecipe.getPhotoPath();
    }



}
