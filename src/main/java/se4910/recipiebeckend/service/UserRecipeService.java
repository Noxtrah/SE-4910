package se4910.recipiebeckend.service;


import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;
import se4910.recipiebeckend.repository.FavoritesRepository;
import se4910.recipiebeckend.repository.MealRepository;
import se4910.recipiebeckend.repository.UserRecipeRepository;
import se4910.recipiebeckend.repository.UserRepository;
import se4910.recipiebeckend.request.UserRecipeRequest;
import se4910.recipiebeckend.response.RecipeDetailResponse;
import se4910.recipiebeckend.response.UserRecipeDetailResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;
import se4910.recipiebeckend.response.UserRecipeResponseFull;

import java.util.*;

@Service
@AllArgsConstructor
public class UserRecipeService {


    RatesService ratesService;
    MealRepository mealRepository;
    FavService favService;
    UserRecipeRepository userRecipeRepository;
    UserRepository userRepository;
    UserService userService;
    FavoritesRepository favoritesRepository;


    public List<UserRecipeResponseFull> doPagingUR(List<UserRecipeResponseFull> cachedDataExtended, int key)
    {
        int pageSize = 6;
        int fromIndex = key * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, cachedDataExtended.size());
        if (fromIndex >= cachedDataExtended.size()) {

            return Collections.emptyList();
        }
        return cachedDataExtended.subList(fromIndex, toIndex);
    }

    @Cacheable("user-recipes")
    public List<UserRecipes> getAllRecipesUR() {
       return userRecipeRepository.findByIsPublishTrue();
    }

    @CacheEvict(value = "user-recipes", allEntries = true)
    public void clearUserRecipesCache() {
        // user-recipes önbelleğini temizle
    }


    public List<UserRecipeResponseFull> fillResponseUR(List<UserRecipes> cachedData, User currentUser) {

        List<UserRecipeResponseFull> responseFull = new ArrayList<>();
        for (UserRecipes userRecipes : cachedData) {
            //     boolean isLiked = likedRecipeIds.contains(userRecipes.getId());
            boolean isLiked = favService.checkFavUserRecipes(currentUser,userRecipes);
            boolean isReported = userService.checkReport(currentUser,userRecipes);
            int rate = ratesService.getRateByUserRecipeAndUser(currentUser,userRecipes);
            double avgRate = ratesService.GetAvgRatesByUserRecipeId(userRecipes.getId());

            responseFull.add(new UserRecipeResponseFull(userRecipes, isLiked, rate, avgRate,isReported));
        }
        return responseFull;
    }

    public List<UserRecipeResponseFull> fillResponseDefaultsUR(List<UserRecipes> cachedData) {

        List<UserRecipeResponseFull> responseFull = new ArrayList<>();
        for (UserRecipes userRecipes : cachedData) {
            //     boolean isLiked = likedRecipeIds.contains(userRecipes.getId());
            boolean isLiked = false;
            boolean isReported = false;
            int rate = 0;
            double avgRate = ratesService.GetAvgRatesByUserRecipeId(userRecipes.getId());
            responseFull.add(new UserRecipeResponseFull(userRecipes, isLiked, rate, avgRate,isReported));
        }
        return responseFull;
    }


    public UserRecipes getUserRecipeByID (long userRecipeId) {

        Optional<UserRecipes> optionalUserRecipes = userRecipeRepository.findById(userRecipeId);
        return optionalUserRecipes.orElse(null);
    }

    public String getUserRecipePhotoByID(long userRecipeId) {

        Optional<UserRecipes> optionalUserRecipes = userRecipeRepository.findById(userRecipeId);
        if (optionalUserRecipes.isPresent()) {
            return optionalUserRecipes.get().getPhotoPath();
        } else return HttpStatus.NOT_FOUND.name();
    }

    public int getMaxPage() {
        int totalItem = userRecipeRepository.findAll().size();
        int maxPage = totalItem /6;

        if (totalItem % 6 >= 1) {
            maxPage++;
        }
        return maxPage;

    }

    public UserRecipeDetailResponse getRecipeDetails(long id, User currentUser) {
        String matchingAllergicFoods = "";
        ArrayList<String> allergicFoodList = getAllergicFoods(currentUser.getAllergicFoods());
        Optional<UserRecipes> targetRecipe = userRecipeRepository.findById(id);
        if (targetRecipe.isPresent())
        {
            String ingredients = targetRecipe.get().getIngredients().toLowerCase();
            for (String allergicFood : allergicFoodList) {
                System.out.println(allergicFood);
                if (ingredients.contains(allergicFood.trim().toLowerCase())) {
                    System.out.println("true");
                    matchingAllergicFoods += allergicFood + ",";

                }
            }
            System.out.println(matchingAllergicFoods);
            return new UserRecipeDetailResponse(targetRecipe.get(), matchingAllergicFoods);
        } else {

            return null;
        }
    }


    public ArrayList<String> getAllergicFoods(String foods) {
        ArrayList<String> allergicFoodList = new ArrayList<>();
        if (foods != null && !foods.isEmpty()) {
            String[] allergicFoodsArray = foods.split(",");
            allergicFoodList.addAll(Arrays.asList(allergicFoodsArray));
        }
        return allergicFoodList;
    }

    public UserRecipeDetailResponse getRecipeDetailsSimple(long id) {
        Optional<UserRecipes> recipe = userRecipeRepository.findById(id);
        return recipe.map(userRecipes -> new UserRecipeDetailResponse(userRecipes, "")).orElse(null);

    }


    public void deleteUserRecipe(long id) {
        Optional<UserRecipes> userRecipes = userRecipeRepository.findById(id);
        userRecipes.ifPresent(recipes -> userRecipeRepository.delete(recipes));

    }
}
