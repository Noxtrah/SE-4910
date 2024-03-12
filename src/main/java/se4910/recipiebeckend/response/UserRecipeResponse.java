package se4910.recipiebeckend.response;

import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;

@Getter
@Setter
public class UserRecipeResponse {

    long id;
    String title;
    String ingredients;
    String description;
    private String cuisine;
    private String meal;
    private int preparationTime;
    String photoPath;
    String username;

    public UserRecipeResponse(UserRecipes userRecipes) {
        this.id = userRecipes.getId();
        this.title = userRecipes.getTitle();
        this.ingredients = userRecipes.getIngredients();
        this.description = userRecipes.getDescription();
        this.cuisine = userRecipes.getCuisine();
        this.meal = userRecipes.getMeal();
        this.preparationTime = userRecipes.getPreparationTime();
        this.photoPath = userRecipes.getPhotoPath();
        this.username = userRecipes.getUser().getUsername();
    }
}
