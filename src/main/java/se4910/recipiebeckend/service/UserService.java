package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import se4910.recipiebeckend.entity.Role;
import se4910.recipiebeckend.entity.User;

import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.repository.UserRecipeRepository;
import se4910.recipiebeckend.repository.UserRepository;
import se4910.recipiebeckend.request.NewUserRequest;
import se4910.recipiebeckend.request.UserRecipeRequest;


import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    UserRecipeRepository userRecipeRepository;
    

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveOneUser(User newUser)
    {
        return userRepository.save(newUser);
    }

    public User getOneUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User getOneUserByUsername(String username) { return userRepository.findUserByUsername(username);}

    public ResponseEntity<String> saveUserRecipe(UserRecipeRequest userRecipeRequest)
    {
        if (userRecipeRequest.getTitle() == null || userRecipeRequest.getIngredients() == null)
        {
            return ResponseEntity.ok("Required fields cannot be empty");
        }
        UserRecipes userRecipes = new UserRecipes();
        if(userRecipeRequest.getCuisine() !=null)
        {
            userRecipes.setCuisine(userRecipeRequest.getCuisine());
        }
        if (userRecipeRequest.getDescription() != null)
        {
              userRecipes.setDescription(userRecipeRequest.getDescription());
        }
        if (userRecipeRequest.getMeal() !=null)
        {
          userRecipes.setMeal(userRecipeRequest.getMeal());
        }
        if (userRecipeRequest.getPhotoPath() != null)
        {
            userRecipes.setPhotoPath(userRecipeRequest.getPhotoPath());
        }
        User user = getOneUserById(userRecipeRequest.getUserId());
        userRecipes.setId(userRecipeRequest.getId());
        userRecipes.setIngredients(userRecipeRequest.getIngredients());
        userRecipes.setTitle(userRecipeRequest.getTitle());
        userRecipes.setUser(user);

        try {
            userRecipeRepository.save(userRecipes);
            return ResponseEntity.ok("Recipe successfully added");
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return  user;
    }

    public UserDetails loadUserById(Long id)
    {
        User user = userRepository.findById(id).get();
        if (user != null)
        {
            return user;
        }
        return null;
    }



}
