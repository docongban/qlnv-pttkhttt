package com.laos.edu.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.laos.edu.commons.Translator;
import com.laos.edu.domain.User;
import com.laos.edu.security.UserNotActivatedException;
import com.laos.edu.security.jwt.JWTFilter;
import com.laos.edu.security.jwt.JwtResponse;
import com.laos.edu.security.jwt.TokenProvider;
import com.laos.edu.service.UserService;
import com.laos.edu.service.dto.AdminUserDTO;
import com.laos.edu.service.mapper.UserMapper;
import com.laos.edu.web.rest.vm.LoginVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Date;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {
    @Autowired
    private UserMapper userMapper;
    private final TokenProvider tokenProvider;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    UserService userService;

    public UserJWTController(TokenProvider tokenProvider, AuthenticationManagerBuilder authenticationManagerBuilder) {
        this.tokenProvider = tokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JwtResponse> authorize(@Valid @RequestBody LoginVM loginVM) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            loginVM.getUsername(),
            loginVM.getPassword()
        );

        try {
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.createToken(authentication, loginVM.isRememberMe());
            User user = userService.getUserWithAuthoritiesByLogin(authentication.getName()).orElse(new User());
            AdminUserDTO userDTO = userMapper.userToAdminUserDTO(user);
            if (userDTO.getExpiredDate() != null && userDTO.getExpiredDate().isBefore(new Date().toInstant())) {
                throw new UserNotActivatedException(Translator.toLocale("account.expired"));
            }
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
            return new ResponseEntity<>(new JwtResponse(jwt, userDTO), httpHeaders, HttpStatus.OK);
        } catch (UserNotActivatedException e) {
            throw new UserNotActivatedException(e.getMessage());
        }catch (InternalAuthenticationServiceException eux){
            throw new UserNotActivatedException(Translator.toLocale("account.not.active"));
        } catch (AuthenticationException ex) {
            throw new UserNotActivatedException(Translator.toLocale("account.invalid"));
        }
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String accessToken;

        JWTToken(String accessToken) {
            this.accessToken = accessToken;
        }

        @JsonProperty("access_token")
        String getAccessToken() {
            return accessToken;
        }

        void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }
    }

}
