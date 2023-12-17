package se4910.recipiebeckend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.OneUserRates;
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
    public ResponseEntity<String> saveUserRecipe(@RequestBody UserRecipeRequest userRecipeRequest)
    {
        return userService.saveUserRecipe(userRecipeRequest);
    }

    @GetMapping("/get-all")
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

    @GetMapping("/get-user-rate")
    public List<OneUserRates> getOneUserRates(Authentication authentication)
    {

        User currentUser = getCurrentUser(authentication);
        return ratesService.getOneUserRates(currentUser);
    }



}
