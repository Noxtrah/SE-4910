package se4910.recipiebeckend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.RateResponse;
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


    public User SaveNewUser( User user)
    {
         return userService.saveOneUser(user);
    }

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
    public ResponseEntity<?> getSavedRecipes(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else
        {
            return userService.getSavedRecipes(currentUser);
        }

    }



    @PostMapping("/publish-recipe")
    public ResponseEntity<?> publishUserRecipe(@RequestParam long userRecipeId )
    {
        return userService.publishUserRecipe(userRecipeId);
    }



    @GetMapping("/all-users")
    public List<User> getAllUsers()
    {
        return userService.getAllUsers();
    }

    @PostMapping("/give-rate")
    public ResponseEntity<?> giveOneRate(@RequestParam int rate,@RequestParam long recipeId, Authentication authentication )
    {

          User currentUser = getCurrentUser(authentication);
          return ratesService.giveOneRate(rate,recipeId, currentUser);

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

    @GetMapping("/get-user-rate")
    public List<RateResponse> getOneUserRates(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        return ratesService.getOneUserRates(currentUser);
    }

    @PostMapping("/give-like")
    public ResponseEntity<?> giveOneLike(@RequestParam long recipeId, Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return favService.giveOneLike(recipeId,currentUser);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @DeleteMapping("/unlike")
    public ResponseEntity<?> unlike(@RequestParam long recipeId ,Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return favService.unlike(recipeId,currentUser);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/user-favorites")
    public List<Recipe> getOneUserFavorites(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        return favService.getOneUserFavorites(currentUser);
    }

    @GetMapping("/user-favorites-id")
    public List<Long> getOneUserFavoritesId(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        return favService.getOneUserFavoritesId(currentUser);
    }



}
