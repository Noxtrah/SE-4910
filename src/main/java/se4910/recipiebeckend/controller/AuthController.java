package se4910.recipiebeckend.controller;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se4910.recipiebeckend.entity.Role;
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
    public AuthResponse login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        return authenticationService.loginUser(loginRequest.getUsername(), loginRequest.getPassword(), response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody NewUserRequest registerRequest) {
       return authenticationService.register(registerRequest);
    }


    @PutMapping("/update-user")
    public String updateUser(@RequestBody NewUserRequest userRequest )
    {
        return authenticationService.updateUser(userRequest);
    }

    @DeleteMapping("/delete-user")
    public String deleteUser(@RequestParam Long id)
    {
        return authenticationService.deleteUser(id);
    }

    @PostMapping("/add-role")
    public String addRole(@RequestParam String roleName)
    {
        try {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
            return "new rol added";
        }
        catch (Exception e) {
            return "Failed to add new role: " + e.getMessage();
        }

    }


}


