package se4910.recipiebeckend.response;

import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.UserRecipes;


@Getter
@Setter
public class RecipeDetailResponse {


    Recipe recipe;
    String allergicFoods;

    public RecipeDetailResponse(Recipe recipe, String allergicFoods) {
        this.recipe = recipe;
        this.allergicFoods = allergicFoods;
    }

}
