package com.laos.edu.service.impl;

import com.laos.edu.domain.Authority;
import com.laos.edu.repository.AuthorityRepository;
import com.laos.edu.service.AuthorityService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuthorityServiceImpl implements AuthorityService {

    private final Logger log = LoggerFactory.getLogger(ApParamServiceImpl.class);

    private final AuthorityRepository authorityRepository;

    public AuthorityServiceImpl(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    @Override
    public List<Authority> getAll() {
        this.log.debug("request to find ap-param by parent-code");
        return authorityRepository.findAll();
    }

    @Override
    public List<Authority> findAllNotAdminUser() {
        return authorityRepository.findAllNotAdminUser();
    }
}
