package se4910.recipiebeckend.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileInfoRequest {

    private String password;

    private String bio;

    private String allergicFoods;

    private String ProfilePhoto;

    public ProfileInfoRequest(String password, String bio, String allergicFoods, String profilePhoto) {
        this.password = password;
        this.bio = bio;
        this.allergicFoods = allergicFoods;
        ProfilePhoto = profilePhoto;
    }
}
