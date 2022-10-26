package com.laos.edu.web.rest;

import com.laos.edu.domain.Authority;
import com.laos.edu.service.AuthorityService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthorityResource {

    @Autowired
    private AuthorityService authorityService;

    @GetMapping("/authority")
    public ResponseEntity<List<Authority>> getAll() {
        List<Authority> list = authorityService.getAll();
        return ResponseEntity.ok().body(list);
    }

    // Get list auth not in admin and user
    @GetMapping("/authority/teacher")
    public ResponseEntity<List<Authority>> getListNotAdminUser() {
        List<Authority> list = authorityService.findAllNotAdminUser();
        return ResponseEntity.ok().body(list);
    }
}
