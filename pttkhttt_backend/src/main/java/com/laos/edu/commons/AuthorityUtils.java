package com.laos.edu.commons;

import com.laos.edu.domain.Authority;
import com.laos.edu.domain.User;
import com.laos.edu.security.AuthoritiesConstants;
import com.laos.edu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;

@Component
public class AuthorityUtils {

    @Autowired
    private UserService userService;

    private static final Authority AUTH_HT = new Authority(AuthoritiesConstants.HT);
    private static final Authority AUTH_GVCN = new Authority(AuthoritiesConstants.GVCN);
    private static final Authority AUTH_ADMIN = new Authority(AuthoritiesConstants.ADMIN);

    public Boolean checkAuthStudentAction() {
        Optional<User> userOpt = this.userService.getUserWithAuthorities();
        User user = userOpt.get();

        Set<Authority> authorities = user.getAuthorities();

        return authorities.contains(AUTH_GVCN) || authorities.contains(AUTH_HT) || authorities.contains(AUTH_ADMIN);
    }

    public Boolean checkAuthTeacherAction(){
        Optional<User> userOpt = this.userService.getUserWithAuthorities();
        User user = userOpt.get();
        Set<Authority> authorities = user.getAuthorities();
        return authorities.contains(AUTH_HT) || authorities.contains(AUTH_ADMIN);
    }
}
