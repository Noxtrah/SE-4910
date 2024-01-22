package se4910.recipiebeckend.response;

import se4910.recipiebeckend.entity.Recipe;

public class OneUserRates {

    Recipe recipe;
    int rate;


    public OneUserRates(Recipe recipe, int rate) {
        this.recipe = recipe;
        this.rate = rate;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }
}
