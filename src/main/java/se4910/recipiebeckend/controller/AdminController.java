package se4910.recipiebeckend.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.*;
import se4910.recipiebeckend.repository.RatesRepository;
import se4910.recipiebeckend.repository.ReportRepository;
import se4910.recipiebeckend.response.CommonRecipeResponse;
import se4910.recipiebeckend.response.RecipeReportDetail;
import se4910.recipiebeckend.response.UserInfoResponse;
import se4910.recipiebeckend.response.UserRecipeResponse;
import se4910.recipiebeckend.service.FavService;
import se4910.recipiebeckend.service.RecipeService;
import se4910.recipiebeckend.service.UserRecipeService;
import se4910.recipiebeckend.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@RestController
@AllArgsConstructor
@RequestMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminController {


    @Autowired
    FavService favService;


    @Autowired
    RecipeService recipeService;


    @Autowired
    UserRecipeService userRecipeService;

    @Autowired
    UserService userService;

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    RatesRepository ratesRepository;


    @GetMapping("/HighLikeRecipes")
    public List<CommonRecipeResponse> highLikeRecipes() {
        List<Object[]> topRecipes = favService.findTop5MostRatedRecipesWithTotalFavorites();
        List<Object[]> topUserRecipes = favService.findTop5MostRatedUserRecipesWithTotalFavorites();

        // Limit the size of the lists to 5
        if (topRecipes.size() > 5) {
            topRecipes = topRecipes.subList(0, 5);
        }
        if (topUserRecipes.size() > 5) {
            topUserRecipes = topUserRecipes.subList(0, 5);
        }

        List<CommonRecipeResponse> result = new ArrayList<>();


        for (Object[] recipeInfo : topRecipes) {
            Long recipeId = (Long) recipeInfo[0]; // Assuming ID is the first element
            Recipe recipe = recipeService.getRecipeByID(recipeId); // Fetch recipe details
            CommonRecipeResponse commonRecipeResponse = new CommonRecipeResponse(recipe);
            result.add(commonRecipeResponse);
        }

        return result;
    }

    @GetMapping("/HighRateRecipes")
    public List<CommonRecipeResponse> highRateRecipes() {
        List<Recipe> topRecipes = ratesRepository.findTop5RateRecipe();
        List<UserRecipes> topUserRecipes = ratesRepository.findTop5RateUserRecipe();

        // Combine the lists
        List<CommonRecipeResponse> result = new ArrayList<>();
        for (Recipe recipe : topRecipes) {
            result.add(new CommonRecipeResponse(recipe));
        }
        for (UserRecipes userRecipe : topUserRecipes) {
            result.add(new CommonRecipeResponse(userRecipe));
        }

        return result;
    }


    @GetMapping("/reported-recipes")
    public List<RecipeReportDetail> reportedRecipeList() {
        List<Long> reportListId = reportRepository.findAllDistinct();

        List<RecipeReportDetail> result = new ArrayList<>();

        // Map each report to UserRecipeResponse
        for (Long id : reportListId) {
            UserRecipes targetRecipe = userRecipeService.getUserRecipeByID(id);
            UserRecipeResponse userRecipeResponse = new UserRecipeResponse(targetRecipe);
            List<Object[]> reportList = reportRepository.ReportDetailByUserRecipes_Id(id);

            RecipeReportDetail recipeReportDetail = new RecipeReportDetail(userRecipeResponse, reportList);
            result.add(recipeReportDetail);
        }
        return result;
    }

 /*   @GetMapping("/reported-recipe-detail")
    public List<RecipeReportDetail> recipeReportDetails(@RequestParam long userRecipeId) {
        List<Object[]> reportCounts = reportRepository.countReportsByCause(userRecipeId);
        return reportCounts.stream()
                .map(obj -> {
                    ReportCause reportCause = (ReportCause) obj[0];
                    Long reportCount = (Long) obj[1];
                    List<Object[]> infoDetails = getInfoDetailsForCause(userRecipeId, reportCause);
                    List<String> infoStringList = infoDetails.stream()
                            .map(arr -> arr[0] + " " + arr[1]) // Concatenate extraNotes and username
                            .collect(Collectors.toList());
                    return new RecipeReportDetail(reportCause, reportCount, infoStringList);
                })
                .collect(Collectors.toList());
    }

    private List<Object[]> getInfoDetailsForCause(Long userRecipeId, ReportCause reportCause) {
        switch (reportCause) {
            case WRONG_INGREDIENT:
                return reportRepository.getInfoDetailsForCause(userRecipeId, "WRONG_INGREDIENT");
            case INAPPROPRIATE_IMAGE:
                return reportRepository.getInfoDetailsForCause(userRecipeId, "INAPPROPRIATE_IMAGE");
            case UNHEALTHY_RECIPE:
                return reportRepository.getInfoDetailsForCause(userRecipeId, "UNHEALTHY_RECIPE");
            default:
                return null;
        }
    }
*/
    @DeleteMapping("/delete-recipe")
    public ResponseEntity<String> deleteRecipeById(@RequestParam long id) {


        try {
            List<Report> reportsToDelete = reportRepository.findByUserRecipes_Id(id);
            reportRepository.deleteAll(reportsToDelete);
             recipeService.deleteRecipe(id);
            return ResponseEntity.ok("Recipe deleted successfully");
        } catch (Exception e) {
            // Handle the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while deleting reports/recipe: " + e.getMessage());
        }

    }

    @DeleteMapping("/discard-report")
    public ResponseEntity<String> discardReport(@RequestParam long id) {
        try {
            // Find all reports with the given userRecipes ID
            List<Report> reportsToDelete = reportRepository.findByUserRecipes_Id(id);

            // Delete the found reports
            reportRepository.deleteAll(reportsToDelete);

            return ResponseEntity.ok("Reports discarded successfully");
        } catch (Exception e) {
            // Handle the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while discarding reports: " + e.getMessage());
        }
    }


}
