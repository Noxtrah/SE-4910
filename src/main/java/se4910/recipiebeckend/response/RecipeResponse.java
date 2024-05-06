package se4910.recipiebeckend.response;

import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.Recipe;


@Getter
@Setter
public class RecipeResponse {


    Recipe recipe;
    Boolean isLiked;
    int rate;

    double avgRate;

    public RecipeResponse(Recipe recipe, Boolean isLiked, int rate, double avgRate) {
        this.recipe = recipe;
        this.isLiked = isLiked;
        this.rate = rate;
        this.avgRate = avgRate;
    }
}

