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
import se4910.recipiebeckend.request.ProfileInfoRequest;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.UserInfoResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;


import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    RecipeService recipeService;

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


    public ResponseEntity<String> publishUserRecipe(long userRecipeId)
    {
        UserRecipes publishRecipe;
        if (userRecipeRepository.findById(userRecipeId).isPresent())
        {
           publishRecipe = userRecipeRepository.findById(userRecipeId).get();
            if (!publishRecipe.getIsPublish()) {
                publishRecipe.setIsPublish(true);
                return new ResponseEntity<>( publishRecipe.getTitle() + " is published", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Recipe is already published", HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    public List<UserRecipeResponse> getSavedRecipes(User currentUser)
    {

        List<UserRecipes> userRecipes = userRecipeRepository.findByUser(currentUser);
       return userRecipes.stream()
                .map(UserRecipeResponse::new)
                .collect(Collectors.toList());
    }

    public ResponseEntity<String> saveUserProfile(ProfileInfoRequest profileInfoRequest, User currentUser) {

        if (!profileInfoRequest.getPassword().isEmpty()) {
            currentUser.setPassword(profileInfoRequest.getPassword());
        }
        if (!profileInfoRequest.getBio().isEmpty()) {
            currentUser.setBio(profileInfoRequest.getBio());
        }
        if (!profileInfoRequest.getAllergicFoods().isEmpty()) {
            currentUser.setAllergicFoods(profileInfoRequest.getAllergicFoods());
        }
        if (!profileInfoRequest.getProfilePhoto().isEmpty()) {
            currentUser.setProfilePhoto(profileInfoRequest.getProfilePhoto());
        }

        userRepository.save(currentUser);
        return new ResponseEntity<>("User updated", HttpStatus.OK);
    }


    public ResponseEntity<UserInfoResponse> getUserInfo(String username)
    {

        User targetUser = userRepository.findUserByUsername(username);
        List<UserRecipes> userRecipesList = recipeService.publishedRecipesOneUser(username);
        return new ResponseEntity<>(new UserInfoResponse(targetUser,userRecipesList),HttpStatus.OK);
    }
}
