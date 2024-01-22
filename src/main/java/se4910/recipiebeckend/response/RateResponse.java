package se4910.recipiebeckend.response;

public class RateResponse {

    Long RecipeId;
    int rate;


    public RateResponse(Long recipeId, int rate) {
        RecipeId = recipeId;
        this.rate = rate;
    }

    public Long getRecipeId() {
        return RecipeId;
    }

    public void setRecipeId(Long recipeId) {
        RecipeId = recipeId;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }
}
