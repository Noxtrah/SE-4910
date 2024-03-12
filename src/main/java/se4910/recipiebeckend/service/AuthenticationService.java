package se4910.recipiebeckend.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.Role;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.RoleRepository;
import se4910.recipiebeckend.repository.UserRepository;
import se4910.recipiebeckend.request.NewUserRequest;
import se4910.recipiebeckend.response.AuthResponse;
import se4910.recipiebeckend.response.NewUserResponse;
import se4910.recipiebeckend.security.JwtUtil;

import java.util.*;

@Service
@AllArgsConstructor
public class AuthenticationService {

    PasswordEncoder passwordEncoder;

    private final JwtUtil jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;


    public AuthResponse loginUser(String username, String password,HttpServletResponse response){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
            User user = userService.getOneUserByUsername(username);
            if (user != null) {
                // Eğer kullanıcı bulunursa, yeni tokenlar oluşturulur
                var jwt = jwtService.generateToken(user);
                var refreshToken = jwtService.generateRefreshToken(user);

                Cookie accessTokenCookie = new Cookie("access_token", jwt);
                accessTokenCookie.setHttpOnly(true); // Sadece sunucuya gönderilmesini sağlar
                accessTokenCookie.setSecure(true); // Sadece HTTPS üzerinden gönderilmesini sağlar
                response.addCookie(accessTokenCookie);

                Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setSecure(true);
                response.addCookie(refreshTokenCookie);

                // Access token ve refresh token birlikte döndürülür
                return AuthResponse.builder()
                        .accessToken("Bearer " + jwt)
                        .refreshToken(refreshToken)
                        .build();
            } else {
                response.setStatus(HttpStatus.UNAUTHORIZED.value()); // Set HTTP 401 status
                return AuthResponse.builder()
                        .message("Invalid username or password")
                        .build();
            }
        } catch (Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value()); // Set HTTP 500 status
            return AuthResponse.builder()
                    .message("Error: " + e.getMessage())
                    .build();
        }

    }

    public ResponseEntity<?> register(NewUserRequest registerRequest) {

        if(registerRequest == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        else {
            User user = new User();
            String password = passwordEncoder.encode(registerRequest.getPassword());
           // user.setDecodedPassword(registerRequest.getPassword());
            user.setUsername(registerRequest.getUsername());
            user.setName(registerRequest.getName());
            user.setLastName(registerRequest.getLastName());
            user.setEmail(registerRequest.getEmail());
            user.setBirthDay(registerRequest.getBirthDay());
            user.setPassword(password);
            user.setRoles(roleConverter("user"));


            if (userService.getOneUserByUsername(user.getUsername()) != null) {
                return  new ResponseEntity<>("this username already used",HttpStatus.BAD_REQUEST);
            }
            userService.saveOneUser(user);
            NewUserResponse newUserResponse = new NewUserResponse(user);
            return new ResponseEntity<>(newUserResponse,HttpStatus.CREATED);

        }
    }

    public String updateUser(NewUserRequest userRequest)
    {
        Long userId = userRequest.getId();
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();


            if (userRequest.getLastName() != null) {
                user.setLastName(userRequest.getLastName());
            }

            if (userRequest.getName() != null) {
                user.setName(userRequest.getName());
            }
            if (userRequest.getUsername() != null) {
                user.setUsername(userRequest.getUsername());
            }
            if (userRequest.getEmail() != null) {
                user.setEmail(userRequest.getEmail());
            }
            if (userRequest.getBirthDay() != null) {
                user.setBirthDay(userRequest.getBirthDay());
            }
            if (userRequest.getPassword() != null) {
                user.setPassword(userRequest.getPassword());
            }
            if (userRequest.getRole() != null) {
                user.setRoles(roleConverter(userRequest.getRole()));
            }

            userRepository.save(user);
            return "User updated successfully";
        } else {
            return "User with ID " + userId + " not found";
        }

    }

    private Set<Role> roleConverter(String role)
    {
        String[] roleNames = {};
        Set<Role> roles = new HashSet<>();
        if(role.contains(","))
        {
            roleNames = role.split(",");

            for (String roleName : roleNames)
            {
                Role userrole = roleRepository.findByName(roleName);
                roles.add(userrole);
            }
        }
        else
        {
            Role userrole = roleRepository.findByName(role);
            roles.add(userrole);
        }

        return roles;
    }

    public String deleteUser(Long id)
    {
        User user = userRepository.findById(id).get();
        if (user != null)
        {
            userRepository.delete(user);
            return "user deleted";
        }
        return null;
    }


}
