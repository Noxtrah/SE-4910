package se4910.recipiebeckend.response;

import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;

import java.sql.Date;
import java.util.List;


@Getter
@Setter
public class UserInfoResponse {

    private String name;
    private String lastName;
    private String username;
    private String email;
    private Date birthDay;
    private String bio;
    private String allergicFoods;
    private byte[] userPhoto;

    List<UserRecipes> userPublishedRecipes;

    public UserInfoResponse(User user, List<UserRecipes> userPublishedRecipes) {
        this.name = user.getName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.birthDay = user.getBirthDay();
        this.bio = user.getBio();
        this.allergicFoods = user.getAllergicFoods();
        this.userPhoto = user.getBlobData();
        this.userPublishedRecipes = userPublishedRecipes;
    }
}
