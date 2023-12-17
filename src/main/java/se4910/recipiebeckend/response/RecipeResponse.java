package se4910.recipiebeckend.response;


import se4910.recipiebeckend.entity.Meal;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;
import java.util.Optional;

public class RecipeResponse {

   // int id;
    String title;
    String ingredients;
    String description;

    private String cuisine;

    private List<Meal> meal;

    private int preparationTime;
    String photoPath;
    double rate;


    public RecipeResponse(Recipe recipe, double rate) {

        this.title = recipe.getTitle();
        this.ingredients = recipe.getIngredients();
        this.description = recipe.getDescription();
        this.cuisine = recipe.getCuisine();
        this.meal = recipe.getMeal();
        this.preparationTime = recipe.getPreparationTime();
        this.photoPath = recipe.getPhotoPath();
        this.rate = rate;

    }

    public RecipeResponse(Recipe recipe)
    {
        this.title = recipe.getTitle();
        this.ingredients = recipe.getIngredients();
        this.description = recipe.getDescription();
        this.cuisine = recipe.getCuisine();
        this.meal = recipe.getMeal();
        this.preparationTime = recipe.getPreparationTime();
        this.photoPath = recipe.getPhotoPath();
    }

    public RecipeResponse(UserRecipes userRecipes)
    {
        this.title = userRecipes.getTitle();
        this.ingredients = userRecipes.getIngredients();
        this.description = userRecipes.getDescription();
        this.photoPath = userRecipes.getPhotoPath();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }
}
