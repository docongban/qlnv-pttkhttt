package com.laos.edu.web.rest;

import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.domain.RegisterPackageDetails;
import com.laos.edu.domain.School;
import com.laos.edu.repository.RegisterPackageRepository;
import com.laos.edu.service.RegisterPackageService;
import com.laos.edu.service.dto.*;
import com.laos.edu.web.rest.errors.BadRequestAlertException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/school-api/api")
public class RegisterPackApiResource {
    private final Logger log = LoggerFactory.getLogger(RegisterPackApiResource.class);

    private static final String ENTITY_NAME = "registerPackage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private RegisterPackageRepository registerPackageRepository;

    private final RegisterPackageService registerPackageService;

    public RegisterPackApiResource(RegisterPackageService registerPackageService) {
        this.registerPackageService = registerPackageService;
    }


    @PostMapping(value = "/register-packages/add")
    public ResponseEntity<?>addRegisterPackage(@RequestBody RegisterDTO registerDTO) throws URISyntaxException {
        log.debug("REST request to save RegisterPackage : {}", registerDTO);
//        ServiceResult<List<RegisterPackageDTO>> result = registerPackageService.saveRegisterPackage(registerDTO);
        return ResponseEntity.ok(registerPackageService.saveRegisterPackage(registerDTO));
    }

    @PostMapping("/register-packages/cancel")
    public ResponseEntity<?>cancelRegisterPackage(@RequestBody RegisterPackageDetailsDTO registerPackageDetailsDTO) throws URISyntaxException {
        log.debug("REST request to save RegisterPackage : {}", registerPackageDetailsDTO);
        ServiceResult<RegisterPackageDTO> result = registerPackageService.cancelRegisterPackage(registerPackageDetailsDTO);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/register-packages/search")
    public ResponseEntity<?> getRegisterPackages(@RequestBody RegisterPackageDetailsDTO dto ){
        return ResponseEntity.ok(registerPackageService.findRegisterPackagesByStatusAndActiveDateExits(dto.getSchoolCode(),dto.getListRegisterPackageCode()));
    }

    @PostMapping("/register-packages/cancelRegisterPackageExpired")
    public ResponseEntity<?> cancelRegisterPackageExpired(@RequestBody ServiceResult<List<RegisterPackageDetails>> result){
        return ResponseEntity.ok(registerPackageService.cancelRegisterPackageExpired(result));
    }

    @PostMapping("/register-packages/history")
    public ResponseEntity<?>getHistoryRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
        ServiceResult<RegisterHistoryDTO> result = registerPackageService.getHistoryRegisterPackage(registerPackageDTO);
        return ResponseEntity.ok().body(result);
    }
}
