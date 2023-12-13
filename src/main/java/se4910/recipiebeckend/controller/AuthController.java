package se4910.recipiebeckend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.repository.RoleRepository;
import se4910.recipiebeckend.request.LoginRequest;
import se4910.recipiebeckend.request.NewUserRequest;
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
    public ResponseEntity<?> register(@RequestBody NewUserRequest registerRequest) {

       return authenticationService.register(registerRequest);
    }


}


