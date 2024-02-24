package se4910.recipiebeckend.response;

import se4910.recipiebeckend.entity.UserRecipes;

public class UserRecipeResponseFull {


    UserRecipeResponse userRecipeResponse;
    Boolean isLiked;
    int rate;
    double avgRate;


    public UserRecipeResponseFull(UserRecipes userRecipes, Boolean isLiked, int rate, double avgRate) {
        this.userRecipeResponse = new UserRecipeResponse(userRecipes);
        this.isLiked = isLiked;
        this.rate = rate;
        this.avgRate = avgRate;
    }
}
