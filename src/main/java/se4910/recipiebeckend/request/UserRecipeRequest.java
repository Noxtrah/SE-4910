package se4910.recipiebeckend.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.processing.Generated;


@Getter
@Setter
@AllArgsConstructor

public class UserRecipeRequest {

    private Long id;
    private String title;
    private String ingredients;
    private String description;
    private String cuisine;
    private String meal;
    private String preparationTime;
    private MultipartFile recipePhoto;



}
