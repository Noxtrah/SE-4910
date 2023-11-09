package se4910.recipiebeckend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.token.TokenService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se4910.recipiebeckend.entity.RefreshToken;
import se4910.recipiebeckend.entity.Role;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.RoleRepository;
import se4910.recipiebeckend.repository.UserRepository;
import se4910.recipiebeckend.request.NewUserRequest;
import se4910.recipiebeckend.request.RefreshRequest;
import se4910.recipiebeckend.response.AuthResponse;
import se4910.recipiebeckend.security.JwtTokenProvider;
import se4910.recipiebeckend.security.JwtUserDetails;


import java.util.HashSet;
import java.util.Set;

@Service
public class AuthenticationService {

    JwtTokenProvider jwtTokenProvider;
    PasswordEncoder passwordEncoder;
    RefreshTokenService refreshTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserService userService;


    public AuthResponse loginUser(String username, String password){

        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        User user = userService.getOneUserByUsername(username);
        UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtTokenProvider.generateJwtToken((JwtUserDetails) userDetails);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("new token");
        authResponse.setAccessToken("Bearer " + jwtToken);
        authResponse.setUserId(user.getId());
        String refreshToken = refreshTokenService.createRefreshToken(user);
        authResponse.setRefreshToken(refreshToken);
        return authResponse;
    }

    public ResponseEntity<AuthResponse> registerUser(NewUserRequest registerRequest)
    {

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setName(registerRequest.getName());
        user.setLastName(registerRequest.getLastName());
        if(registerRequest.getBirthDay() != null)
        {
            user.setBirthDay(registerRequest.getBirthDay());
        }
        user.setEmail(registerRequest.getEmail());
        Role userRole = roleRepository.findByName("USER");
        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);
        user.setRoles(authorities);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userService.saveOneUser(user);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Registration successful.");
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);


    }

    public ResponseEntity<AuthResponse>  refresh(RefreshRequest refreshRequest) {

        AuthResponse response = new AuthResponse();
        RefreshToken token = refreshTokenService.getByUser(refreshRequest.getUserId());
        if(token.getToken().equals(refreshRequest.getRefreshToken()) &&
                !refreshTokenService.isRefreshExpired(token)) {

            User user = token.getUser();
            String jwtToken = jwtTokenProvider.generateJwtTokenByUserId(user.getId());
            response.setMessage("token successfully refreshed.");
            response.setAccessToken("Bearer " + jwtToken);
            response.setUserId(user.getId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setMessage("refresh token is not valid.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}
