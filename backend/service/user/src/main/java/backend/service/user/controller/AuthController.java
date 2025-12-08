package backend.service.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Iterator;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/userRole")
    public String userRole() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();

        GrantedAuthority authority = iterator.next();

        String role = authority.getAuthority();


        return "email: " + email + ", role :" + role;
    }
}
