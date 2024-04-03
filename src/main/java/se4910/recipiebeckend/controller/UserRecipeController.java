package se4910.recipiebeckend.controller;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.response.RecipeResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;
import se4910.recipiebeckend.response.UserRecipeResponseFull;
import se4910.recipiebeckend.service.*;

import java.util.List;

@Getter
@Setter
@RestController
@RequestMapping(value = "/recipesUser", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserRecipeController extends ParentController{


    @Autowired
    RecipeService recipeService;

    @Autowired
    UserService userService;

    @Autowired
    RatesService ratesService;

    @Autowired
    FavService favService;

    @Autowired
    UserRecipeService userRecipeService;

    private List<UserRecipes> cachedData;

    private List<UserRecipeResponseFull> cachedDataExtended;
    @GetMapping("/paging-user-dashboard")
    public List<UserRecipeResponseFull> paging(@RequestParam(name = "key", defaultValue = "0") int key)
    {
        cachedDataExtended =  userRecipeService.doPagingUR(cachedDataExtended,key);
        return cachedDataExtended;

    }

    private void updateCachedData(User currentUser) {
        if (currentUser != null) {
            cachedDataExtended = userRecipeService.fillResponseUR(cachedData, currentUser);
        } else {
            cachedDataExtended = userRecipeService.fillResponseDefaultsUR(cachedData);
        }
    }

    @GetMapping("/home-user-dashboard")
    public List<UserRecipeResponseFull> getCustomDataUserDashboard(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        cachedData = userRecipeService.getAllRecipesUR();
        setCachedData(cachedData);
        updateCachedData(currentUser);
        return paging(0);

    }

    @PostMapping("/give-rate-user-recipe")
    public ResponseEntity<String> giveOneRateUserRecipe(@RequestParam int rate, @RequestParam long userRecipeId, Authentication authentication )
    {

        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return ratesService.giveOneRateUserRecipe(rate,userRecipeId, currentUser);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/give-like-user-recipes")
    public ResponseEntity<String> giveOneLikeUserRecipes(@RequestParam long userReciceId, Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return favService.giveOneLikeUserRecipes(userReciceId,currentUser);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }


}
