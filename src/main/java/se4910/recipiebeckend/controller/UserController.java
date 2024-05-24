package se4910.recipiebeckend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.service.UserService;


@RequestMapping("/user")
@RestController
public class UserController {

    @Autowired
    UserService userService;

    public User SaveNewUser( User user)
    {
         return userService.saveOneUser(user);
    }


    @PostMapping("/save-recipe")
    public ResponseEntity<String> saveUserRecipe(@RequestBody UserRecipeRequest userRecipeRequest)
    {
        return userService.saveUserRecipe(userRecipeRequest);
    }


}
