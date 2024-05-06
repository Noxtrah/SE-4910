package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
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

    public ResponseEntity<?> saveUserRecipe(UserRecipeRequest userRecipeRequest,User user) throws IOException {
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
        if (userRecipeRequest.getRecipePhoto()!= null)
        {
            userRecipes.setBlobData(userRecipeRequest.getRecipePhoto().getBytes());
        }

        userRecipes.setIngredients(userRecipeRequest.getIngredients());
        userRecipes.setTitle(userRecipeRequest.getTitle());
        userRecipes.setUser(user);
        userRecipes.setIsPublish(false);

        try {
            userRecipeRepository.save(userRecipes);
           // saveUserRecipeToDataset(userRecipeRequest);
            return ResponseEntity.ok("Recipe successfully added");
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    private void saveUserRecipeToDataset(UserRecipeRequest userRecipeRequest) {

        RestTemplate restTemplate = new RestTemplate();

        // Define the URL of your Python Flask application
        String pythonUrl = "http://azure-python-project-url.com/add-recipe-to-dataset";

        // Create headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create request body
        String requestBody = "{" +
                "\"recipe_name\":\"" + userRecipeRequest.getTitle() + "\"," +
                "\"prep_time\":\"" + userRecipeRequest.getPreparationTime() + "\"," +
                // Add other fields similarly
                "}";

        // Create HttpEntity
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        // Make a POST request to the Python Flask endpoint
        ResponseEntity<String> response = restTemplate.postForEntity(pythonUrl, entity, String.class);

        // Handle the response
        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Recipe added to dataset successfully");
        } else {
            System.err.println("Failed to add recipe to dataset");
        }
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
            currentUser.setBlobData(profileInfoRequest.getProfilePhoto().getBytes());
        }

        userRepository.save(currentUser);
        return new ResponseEntity<>("User updated", HttpStatus.OK);
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
          return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    public boolean checkReport(User currentUser, UserRecipes userRecipes) {

        return (reportRepository.findByUserAndUserRecipes(currentUser,userRecipes)).isPresent();
    }
}
