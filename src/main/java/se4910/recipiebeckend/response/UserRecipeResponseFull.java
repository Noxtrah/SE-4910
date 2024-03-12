package se4910.recipiebeckend.response;

import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.UserRecipes;

@Getter
@Setter
public class UserRecipeResponseFull extends UserRecipeResponse{


    Boolean isLiked;
    int rate;
    double avgRate;


    public UserRecipeResponseFull(UserRecipes userRecipes, Boolean isLiked, int rate, double avgRate) {
        super(userRecipes);
        this.isLiked = isLiked;
        this.rate = rate;
        this.avgRate = avgRate;
    }
}
