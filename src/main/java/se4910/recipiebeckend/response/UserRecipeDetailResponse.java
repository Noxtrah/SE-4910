package se4910.recipiebeckend.response;

import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.UserRecipes;


@Getter
@Setter
public class UserRecipeDetailResponse extends  UserRecipeResponse{


    String allergicFoods;
    public UserRecipeDetailResponse(UserRecipes userRecipes,String allergicFoods) {
        super(userRecipes);
        this.allergicFoods = allergicFoods;
    }
}
