package se4910.recipiebeckend.response;



import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.Arrays;

@Getter
@Setter
public class CommonRecipeResponse {

    long id;
    String title;
    String ingredients;
    String description;
    private int preparationTime;
    String photoPath;


    public CommonRecipeResponse(Recipe recipe) {
        this.id = recipe.getId();
        this.title = recipe.getTitle();
        this.ingredients = recipe.getIngredients();
        this.description = recipe.getDescription();
        this.preparationTime = recipe.getPreparationTime();
        this.photoPath = recipe.getPhotoPath();
    }

    public CommonRecipeResponse(UserRecipes userRecipes) {
        this.id = userRecipes.getId();
        this.title = userRecipes.getTitle();
        this.ingredients = userRecipes.getIngredients();
        this.description = userRecipes.getDescription();
        this.preparationTime = userRecipes.getPreparationTime();
        this.photoPath = Arrays.toString(userRecipes.getBlobData());
    }
}




