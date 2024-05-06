package se4910.recipiebeckend.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.processing.Generated;


@Getter
@Setter
public class UserRecipeRequest {

    private String title;
    private String ingredients;
    private String description;
    private String cuisine;
    private String meal;
    private int preparationTime;
    private MultipartFile recipePhoto;


    public UserRecipeRequest(String title, String ingredients, String description, String cuisine, String meal, int preparationTime, MultipartFile recipePhoto) {
        this.title = title;
        this.ingredients = ingredients;
        this.description = description;
        this.cuisine = cuisine;
        this.meal = meal;
        this.preparationTime = preparationTime;
        this.recipePhoto = recipePhoto;
    }
}
