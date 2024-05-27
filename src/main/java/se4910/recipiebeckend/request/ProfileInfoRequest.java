package se4910.recipiebeckend.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProfileInfoRequest {


    private String bio;

    private String allergicFoods;

    private MultipartFile profilePhoto;


    public ProfileInfoRequest( String bio, String allergicFoods, MultipartFile profilePhoto) {

        this.bio = bio;
        this.allergicFoods = allergicFoods;
        this.profilePhoto = profilePhoto;
    }
}
