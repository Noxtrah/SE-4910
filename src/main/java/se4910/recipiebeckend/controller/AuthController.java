package se4910.recipiebeckend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.repository.RoleRepository;
import se4910.recipiebeckend.request.LoginRequest;
import se4910.recipiebeckend.request.NewUserRequest;
import se4910.recipiebeckend.request.RefreshRequest;
import se4910.recipiebeckend.response.AuthResponse;
import se4910.recipiebeckend.service.AuthenticationService;
import se4910.recipiebeckend.service.UserService;


@RestController
@RequestMapping("/auth")
public class AuthController
{

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserService userService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {

        return authenticationService.loginUser(loginRequest.getUsername(),loginRequest.getPassword());

    }


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody NewUserRequest registerRequest) {

        AuthResponse authResponse = new AuthResponse();
        if(userService.getOneUserByUsername(registerRequest.getUsername()) != null) {
            authResponse.setMessage("Username already in use.");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        else {
            return authenticationService.registerUser(registerRequest);
        }

    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest refreshRequest) {

       return authenticationService.refresh(refreshRequest);


    }
}


