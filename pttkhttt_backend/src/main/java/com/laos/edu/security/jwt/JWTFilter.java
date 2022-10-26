package com.laos.edu.security.jwt;

import com.laos.edu.commons.Translator;
import com.laos.edu.config.APIKeyAuthFilter;
import com.laos.edu.security.DomainUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filters incoming requests and installs a Spring Security principal if a header corresponding to a valid user is
 * found.
 */
@Component
public class JWTFilter extends OncePerRequestFilter {

    @Value("${request.http.auth-token-header-name}")
    private String principalRequestHeader;

    @Value("${request.http.auth-token}")
    private String principalRequestValue;
    public static final String AUTHORIZATION_HEADER = "Authorization";

    private final TokenProvider tokenProvider;
    @Autowired
    DomainUserDetailsService domainUserDetailsService;

    public JWTFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void doFilterInternal(HttpServletRequest servletRequest, HttpServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String jwtToken = resolveToken(httpServletRequest);
        //only access call api from school
        if (httpServletRequest.getRequestURI().contains("school-api")) {
            APIKeyAuthFilter filterApi = new APIKeyAuthFilter(principalRequestHeader);
            String principal = filterApi.getPreAuthenticatedPrincipal(servletRequest).toString();
            Authentication authentication = new PreAuthenticatedAuthenticationToken(principal, null);
            if (!principalRequestValue.equals(principal)) {
                throw new AccessDeniedException(Translator.toLocale("msg.school.api.not.access"));
            }
            authentication.setAuthenticated(true);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            if (StringUtils.hasText(jwtToken) && this.tokenProvider.validateToken(jwtToken)) {
                Authentication authentication = this.tokenProvider.getAuthentication(jwtToken);
                UserDetails userDetails = domainUserDetailsService.loadUserByUsername(authentication.getName());
                // if token is valid configure Spring Security to manually set authentication
                if (this.tokenProvider.validateToken(jwtToken)) {
                    String refreshToken = this.tokenProvider.createToken(authentication, false);
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(servletRequest));
                    // After setting the Authentication in the context, we specify
                    // that the current user is authenticated. So i t passes the
                    // Spring Security Configurations successfully.
                    servletResponse.setHeader(AUTHORIZATION_HEADER, refreshToken);
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }

            }
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
