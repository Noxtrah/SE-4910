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
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.*;
import se4910.recipiebeckend.service.*;

import java.io.IOException;
import java.util.ArrayList;
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

    private List<UserRecipes> cachedData = new ArrayList<>();

    private List<UserRecipeResponseFull> cachedDataExtended = new ArrayList<>();


    public List<UserRecipeResponseFull> paging(int key)
    {
       return userRecipeService.doPagingUR(cachedDataExtended,key);

    }

    private void updateCachedData(User currentUser) {
        if (currentUser != null) {
            cachedDataExtended = userRecipeService.fillResponseUR(cachedData, currentUser);
        } else {
            cachedDataExtended = userRecipeService.fillResponseDefaultsUR(cachedData);
        }
    }

    @GetMapping("/home-user-dashboard")
    public List<UserRecipeResponseFull> getCustomDataUserDashboard(@RequestParam(name = "key", defaultValue = "0") int key, Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        cachedData = userRecipeService.getAllRecipesUR();
        setCachedData(cachedData);
        updateCachedData(currentUser);
        return paging(key);

    }

    @PutMapping("/edit-user-recipe")
    public ResponseEntity<String> editUserRecipe(@ModelAttribute UserRecipeRequest userRecipeRequest, Authentication authentication)throws IOException {
        User currentUser = getCurrentUser(authentication);
        return userService.editUserRecipe(userRecipeRequest, currentUser);
    }

    @PutMapping("/edit-user-recipe-noAuth")
    public ResponseEntity<String> editUserRecipeNoAuth(@ModelAttribute UserRecipeRequest userRecipeRequest)throws IOException {
        return userService.editUserRecipeNoAuth(userRecipeRequest);
    }


    @GetMapping("/get-max-page-ur")
    public int getMaxPage()
    {
        return userRecipeService.getMaxPage();
    }
    @GetMapping("/user-recipe-photoPath")
    public String getUserRecipePhotoInfo(@RequestParam long userRecipeId)
    {
        return userRecipeService.getUserRecipePhotoByID(userRecipeId);
    }
    @GetMapping("/user-recipe-byID")
    public UserRecipeDetailResponse getUserRecipeInfo(@RequestParam long userRecipeId, Authentication authentication)
    {
        User currentUser =getCurrentUser(authentication);
        if (currentUser != null)
        {
            return userRecipeService.getRecipeDetails(userRecipeId,currentUser);
        }
       return userRecipeService.getRecipeDetailsSimple(userRecipeId);
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
    public ResponseEntity<String> giveOneLikeUserRecipes(@RequestParam long userRecipeId, Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return favService.giveOneLikeUserRecipes(userRecipeId,currentUser);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }


}
