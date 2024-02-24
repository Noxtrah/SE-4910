package se4910.recipiebeckend.response;


import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;

public class RecipeInfoResponse {

    List<Recipe> LikedRecipeList;
    List<UserRecipes> LikedUserRecipesList;
    List<RateResponse>rateResponseList;

    List<RateResponse>rateResponseUserRcipesList;


    public RecipeInfoResponse(List<Recipe> likedRecipeList, List<UserRecipes> likedUserRecipesList, List<RateResponse> rateResponseList, List<RateResponse> rateResponseUserRcipesList) {
        LikedRecipeList = likedRecipeList;
        LikedUserRecipesList = likedUserRecipesList;
        this.rateResponseList = rateResponseList;
        this.rateResponseUserRcipesList = rateResponseUserRcipesList;
    }

    public List<RateResponse> getRateResponseList() {
        return rateResponseList;
    }

    public void setRateResponseList(List<RateResponse> rateResponseList) {
        this.rateResponseList = rateResponseList;
    }
}
