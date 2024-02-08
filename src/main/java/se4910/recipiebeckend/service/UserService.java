package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.User;

import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.repository.UserRecipeRepository;
import se4910.recipiebeckend.repository.UserRepository;
import se4910.recipiebeckend.request.UserRecipeRequest;


import java.util.List;

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

    public User getOneUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public ResponseEntity<?> saveUserRecipe(UserRecipeRequest userRecipeRequest,User user)
    {
        if (userRecipeRequest.getTitle().isEmpty()|| userRecipeRequest.getIngredients().isEmpty())
        {
            return new ResponseEntity<>("title and getIngredients can not be empty",HttpStatus.BAD_REQUEST);
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


    public ResponseEntity<?> publishUserRecipe(long userRecipeId)
    {
        UserRecipes publishRecipe;
        if (userRecipeRepository.findById(userRecipeId).isPresent())
        {
           publishRecipe = userRecipeRepository.findById(userRecipeId).get();
           publishRecipe.setIsPublish(true);
           return new ResponseEntity<>(publishRecipe,HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    public ResponseEntity<?> getSavedRecipes(User currentUser)
    {

        List<UserRecipes> userRecipes = userRecipeRepository.findByUser(currentUser);
        return new ResponseEntity<>(userRecipes,HttpStatus.OK);

    }
}
