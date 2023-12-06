package se4910.recipiebeckend.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.RefreshToken;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.RoleRepository;
import se4910.recipiebeckend.request.NewUserRequest;
import se4910.recipiebeckend.request.RefreshRequest;
import se4910.recipiebeckend.response.AuthResponse;
import se4910.recipiebeckend.response.NewUserResponse;
import se4910.recipiebeckend.security.JwtUtil;

@Service
@AllArgsConstructor
public class AuthenticationService {

    PasswordEncoder passwordEncoder;

    private final JwtUtil jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserService userService;


    public AuthResponse loginUser(String username, String password){

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
            User user = userService.getOneUserByUsername(username);
            if (user != null) {
                // Eğer kullanıcı bulunursa, yeni tokenlar oluşturulur
                var jwt = jwtService.generateToken(user);
                var refreshToken = jwtService.generateRefreshToken(user);

                // Access token ve refresh token birlikte döndürülür
                return AuthResponse.builder()
                        .accessToken("Bearer " + jwt)
                        .refreshToken(refreshToken)
                        .build();
            } else {
                return AuthResponse.builder()
                        .accessToken("invalid username or password")
                        .build();
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return AuthResponse.builder().accessToken("An error occurred").build();
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
            user.setPassword(password);

            if (userService.getOneUserByUsername(user.getUsername()) != null) {
                return  new ResponseEntity<>("this username already used",HttpStatus.BAD_REQUEST);
            }
            userService.saveOneUser(user);
            NewUserResponse newUserResponse = new NewUserResponse(user);
            return new ResponseEntity<>(newUserResponse,HttpStatus.CREATED);

        }
    }

}
