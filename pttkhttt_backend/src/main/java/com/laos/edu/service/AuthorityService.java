package com.laos.edu.service;

import com.laos.edu.domain.Authority;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface AuthorityService {
    public List<Authority> getAll();

    public List<Authority> findAllNotAdminUser();
}
