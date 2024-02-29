package se4910.recipiebeckend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Favorites;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.request.ProfileInfoRequest;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.RateResponse;
import se4910.recipiebeckend.response.UserInfoResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;
import se4910.recipiebeckend.service.FavService;
import se4910.recipiebeckend.service.RatesService;
import se4910.recipiebeckend.service.UserService;

import java.util.List;


@RequestMapping("/user")
@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    RatesService ratesService;

    @Autowired
    FavService favService;


    public User getCurrentUser(Authentication authentication) {

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            return userService.getOneUserByUsername(username);

        }
        else {

            return null;
        }
    }

    @PostMapping("/save-recipe")
    public ResponseEntity<?> saveUserRecipe(@RequestBody UserRecipeRequest userRecipeRequest,Authentication authentication )
    {
        User currentUser = getCurrentUser(authentication);
        return userService.saveUserRecipe(userRecipeRequest,currentUser);
    }

    @GetMapping("/get-saved-recipes")
    public List<UserRecipeResponse> getSavedRecipes(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null)
        {
            return null;
        }
        else
        {
            return userService.getSavedRecipes(currentUser);
        }

    }

    @PostMapping("/publish-recipe")
    public ResponseEntity<String> publishUserRecipe(@RequestParam long userRecipeId )
    {
        return userService.publishUserRecipe(userRecipeId);
    }


    @GetMapping("/all-users")
    public List<User> getAllUsers()
    {
        return userService.getAllUsers();
    }

    @PostMapping("/give-rate")
    public ResponseEntity<String> giveOneRate(@RequestParam int rate,@RequestParam long recipeId, Authentication authentication )
    {

          User currentUser = getCurrentUser(authentication);
          return ratesService.giveOneRate(rate,recipeId, currentUser);

    }

    @PostMapping("/give-rate-user-recipe")
    public ResponseEntity<String> giveOneRateUserRecipe(@RequestParam int rate,@RequestParam long userRecipeId, Authentication authentication )
    {

        User currentUser = getCurrentUser(authentication);
        return ratesService.giveOneRateUserRecipe(rate,userRecipeId, currentUser);

    }

    @GetMapping("/authHello")
    public ResponseEntity<String> authHello(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            String firstName = currentUser.getName();
             return ResponseEntity.ok("Hello " + firstName);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @PostMapping("/give-like")
    public ResponseEntity<String> giveOneLike(@RequestParam long recipeId, Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return favService.giveOneLike(recipeId,currentUser);
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

    @GetMapping("/user-favorites")
    public ResponseEntity<List<Object>> getOneUserFavorites(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return favService.getOneUserFavorites(currentUser);
        }
        return null;

    }

    @PutMapping("/save-user-profile")
    public ResponseEntity<String> saveUserProfile(@RequestBody ProfileInfoRequest profileInfoRequest, Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return userService.saveUserProfile(profileInfoRequest,currentUser);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @GetMapping("/user-profile-info")
    public ResponseEntity<UserInfoResponse> getUserInfo(@RequestParam String username)
    {

        return userService.getUserInfo(username);
    }




}
