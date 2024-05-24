package se4910.recipiebeckend.controller;


import com.azure.storage.blob.BlobServiceClient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.service.UserService;



@RestController
@Getter
@Setter
public class ParentController {


    @Autowired
    UserService userService;



    public User getCurrentUser(Authentication authentication) {

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            return userService.getOneUserByUsername(username);
        }
        else {
            return null;
        }
    }






}
