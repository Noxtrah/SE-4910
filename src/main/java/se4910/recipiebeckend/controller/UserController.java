package se4910.recipiebeckend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.request.ProfileInfoRequest;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.UserFavoritesResponse;
import se4910.recipiebeckend.response.UserInfoResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;
import se4910.recipiebeckend.service.FavService;
import se4910.recipiebeckend.service.RatesService;
import se4910.recipiebeckend.service.UserService;

import java.io.IOException;
import java.util.List;


@RequestMapping("/user")
@RestController
public class UserController extends ParentController {

    @Autowired
    UserService userService;

    @Autowired
    RatesService ratesService;

    @Autowired
    FavService favService;



    @PostMapping("/save-recipe")
    public ResponseEntity<?> saveUserRecipe(@RequestBody UserRecipeRequest userRecipeRequest,Authentication authentication ) throws IOException {
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

    @PutMapping("/unpublish-recipe")
    public ResponseEntity<String> unpublishUserRecipe(@RequestParam long userRecipeId)
    {
        return userService.unpublishUserRecipe(userRecipeId);
    }

    @DeleteMapping("/delete-user-recipe")
    public ResponseEntity<String> deleteUserRecipe(@RequestParam long userRecipeId)
    {
        return userService.deleteUserRecipe(userRecipeId);
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
        if (currentUser != null)
        {
            return ratesService.giveOneRate(rate,recipeId, currentUser);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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


    @GetMapping("/user-favorites")
    public ResponseEntity<List<UserFavoritesResponse>> getOneUserFavorites(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return favService.getOneUserFavorites(currentUser);
        }
        return null;

    }

    @PutMapping("/save-user-profile")
    public ResponseEntity<String> saveUserProfile(@RequestBody ProfileInfoRequest profileInfoRequest, Authentication authentication) throws IOException {
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
