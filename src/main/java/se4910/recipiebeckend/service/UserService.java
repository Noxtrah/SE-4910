package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CachePut;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import se4910.recipiebeckend.controller.ParentController;
import se4910.recipiebeckend.entity.Report;
import se4910.recipiebeckend.entity.ReportCause;
import se4910.recipiebeckend.entity.User;

import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.repository.ReportRepository;
import se4910.recipiebeckend.repository.UserRecipeRepository;
import se4910.recipiebeckend.repository.UserRepository;
import se4910.recipiebeckend.request.ProfileInfoRequest;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.UserInfoResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {


    UserRepository userRepository;

    RecipeService recipeService;
    UserRecipeRepository userRecipeRepository;

    ReportRepository reportRepository;

    AzurePhotoService azurePhotoService;



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

    @CachePut(value = "user-recipes")
    public ResponseEntity<?> saveUserRecipe(UserRecipeRequest userRecipeRequest,User user) throws IOException {

        if (userRecipeRequest.getTitle().isEmpty() || userRecipeRequest.getIngredients().isEmpty())
        {
            return new ResponseEntity<>("title and getIngredients can not be empty",HttpStatus.BAD_REQUEST);
        }
        UserRecipes userRecipes = new UserRecipes();
        userRecipes.setIsPublish(false);
        userRecipes.setUser(user);
        return  manipulateUserRecipeData(userRecipeRequest, userRecipes);

    }

    @CachePut(value = "user-recipes")
    public ResponseEntity<String> editUserRecipe(UserRecipeRequest userRecipeRequest, User currentUser) {

        Optional<UserRecipes> optionalUserRecipes = userRecipeRepository.findById(userRecipeRequest.getId());
        if (optionalUserRecipes.isPresent())
        {
            UserRecipes targetRecipe = optionalUserRecipes.get();
            targetRecipe.setUser(currentUser);
            return manipulateUserRecipeData(userRecipeRequest,targetRecipe);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    private ResponseEntity<String> manipulateUserRecipeData(UserRecipeRequest userRecipeRequest, UserRecipes userRecipes) {

        if(userRecipeRequest.getTitle() != null)
        {
            userRecipes.setTitle(userRecipeRequest.getTitle());
        }
        if(userRecipeRequest.getIngredients() != null)
        {
            userRecipes.setIngredients(userRecipeRequest.getIngredients());
        }
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
        if (userRecipeRequest.getRecipePhoto()!= null)
        {
            String photoUrlString = azurePhotoService.uploadPhotoToBlobStorage(userRecipeRequest.getRecipePhoto());
            userRecipes.setPhotoPath(photoUrlString);
        }
        if (userRecipeRequest.getPreparationTime() != null ) {
            userRecipes.setPreparationTime(Integer.parseInt(userRecipeRequest.getPreparationTime()));
        }

        try {
            userRecipeRepository.save(userRecipes);
            return new ResponseEntity<>("successful",HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return null;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return  user;
    }

    public ResponseEntity<String> publishUserRecipe(long userRecipeId)
    {
        UserRecipes publishRecipe;
        if (userRecipeRepository.findById(userRecipeId).isPresent())
        {
           publishRecipe = userRecipeRepository.findById(userRecipeId).get();
            if (!publishRecipe.getIsPublish()) {
                publishRecipe.setIsPublish(true);
                userRecipeRepository.save(publishRecipe);
                return new ResponseEntity<>( publishRecipe.getTitle() + " is published", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Recipe is already published", HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    public ResponseEntity<String> unpublishUserRecipe(long userRecipeId) {

        UserRecipes targetRecipe;
        if (userRecipeRepository.findById(userRecipeId).isPresent())
        {
            targetRecipe = userRecipeRepository.findById(userRecipeId).get();
            if (targetRecipe.getIsPublish()){

                targetRecipe.setIsPublish(false);
                userRecipeRepository.save(targetRecipe);
                return new ResponseEntity<>("recipe unpublished",HttpStatus.OK);
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

    public ResponseEntity<String> saveUserProfile(ProfileInfoRequest profileInfoRequest, User currentUser) throws IOException {

            if (profileInfoRequest.getBio() != null && !profileInfoRequest.getBio().isEmpty()) {
                currentUser.setBio(profileInfoRequest.getBio());
            }
            if (profileInfoRequest.getAllergicFoods() != null && !profileInfoRequest.getAllergicFoods().isEmpty()) {
                currentUser.setAllergicFoods(profileInfoRequest.getAllergicFoods());
            }
            if (profileInfoRequest.getProfilePhoto() != null && !profileInfoRequest.getProfilePhoto().isEmpty()) {
                currentUser.setProfilePhotoPath(azurePhotoService.uploadPhotoToBlobStorage(profileInfoRequest.getProfilePhoto()));
            }

            userRepository.save(currentUser);
            return new ResponseEntity<>("user updated", HttpStatus.OK);
    }



    public ResponseEntity<UserInfoResponse> getUserInfo(User currentUser)
    {
        List<UserRecipes> userRecipesList = recipeService.publishedRecipesOneUser(currentUser.getUsername());
        List<UserRecipeResponse> userPublishedRecipes = new ArrayList<>();
        for (UserRecipes userRecipes : userRecipesList) {
            UserRecipeResponse userRecipeResponse = new UserRecipeResponse(userRecipes);
            userPublishedRecipes.add(userRecipeResponse);
        }
        return new ResponseEntity<>(new UserInfoResponse(currentUser,userPublishedRecipes),HttpStatus.OK);
    }


    public ResponseEntity<String> deleteUserRecipe(long userRecipeId) {

        UserRecipes targetRecipe;
        if (userRecipeRepository.findById(userRecipeId).isPresent())
        {
            targetRecipe = userRecipeRepository.findById(userRecipeId).get();
            userRecipeRepository.delete(targetRecipe);
            return new ResponseEntity<>("recipe deleted",HttpStatus.OK);
        }
        return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> reportOneRecipe(long userRecipeId, ReportCause reportCause, String extraNotes, User currentUser) {

        Optional<UserRecipes> targetRecipe = userRecipeRepository.findById(userRecipeId);

        if (targetRecipe.isPresent())
        {
            Optional<Report> optionalReport = reportRepository.findByUserAndUserRecipes(currentUser,targetRecipe.get());
            if (optionalReport.isPresent())
            {
                return new ResponseEntity<>("You have already reported this recipe." , HttpStatus.ALREADY_REPORTED);
            }
            else {

                Report report = new Report();
                report.setExtraNotes(extraNotes);
                report.setUser(currentUser);
                report.setReportCause(reportCause);
                report.setUserRecipes(targetRecipe.get());
                reportRepository.save(report);

                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    public boolean checkReport(User currentUser, UserRecipes userRecipes) {

        return (reportRepository.findByUserAndUserRecipes(currentUser,userRecipes)).isPresent();
    }



    public ResponseEntity<String> editUserRecipeNoAuth(UserRecipeRequest userRecipeRequest) {

        Optional<UserRecipes> optionalUserRecipes = userRecipeRepository.findById(userRecipeRequest.getId());
        if (optionalUserRecipes.isPresent())
        {
            UserRecipes targetRecipe = optionalUserRecipes.get();
            return manipulateUserRecipeData(userRecipeRequest,targetRecipe);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<String> getAllergiesOneUser(User currentUser) {

        if (currentUser.getAllergicFoods().isEmpty())
        {
            return new ResponseEntity<>("no allergies",HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>( currentUser.getAllergicFoods(),HttpStatus.OK) ;
        }

    }
}
