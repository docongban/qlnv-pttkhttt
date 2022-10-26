package com.laos.edu.web.rest;

import com.laos.edu.commons.ResponseUtils;
import com.laos.edu.domain.School;
import com.laos.edu.repository.SchoolRepository;
import com.laos.edu.repository.UserRepository;
import com.laos.edu.service.MailService;
import com.laos.edu.service.SchoolService;
import com.laos.edu.service.UserService;
import com.laos.edu.service.dto.DataPackageDTO;
import com.laos.edu.service.dto.SchoolDTO;
import com.laos.edu.service.dto.ServiceResult;
import com.laos.edu.web.rest.vm.ManagedUserVM;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/school-api/school/")
public class SchoolApiResource {

    private static class AccountResourceException extends RuntimeException {

        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final SchoolService schoolService;

    private final Logger log = LoggerFactory.getLogger(SchoolApiResource.class);

    private final UserRepository userRepository;

    private final UserService userService;

    private final MailService mailService;

    private final SchoolRepository schoolRepository;

    public SchoolApiResource(UserRepository userRepository, UserService userService, MailService mailService, SchoolService schoolService, SchoolRepository schoolRepository) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.mailService = mailService;
        this.schoolService = schoolService;
        this.schoolRepository = schoolRepository;
    }


    /**
     * {@code GET  /authenticate} : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request.
     * @return the login if the user is authenticated.
     */
    @GetMapping("/authenticate")
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return "cmr";
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<SchoolDTO>> getAllSchools(Pageable pageable) {
        log.debug("REST request to get a page of Schools");
        Page<SchoolDTO> page = schoolService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    private static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
                password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
                password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }

    @GetMapping("/get-school-by-code/{code}")
    public ResponseEntity<SchoolDTO> getSchoolByCode(@PathVariable String code) {
        log.debug("REST request to get School : {}", code);
        Optional<SchoolDTO> schoolDTO = schoolService.findOne(code);
        if (schoolDTO.isPresent()) {
            return ResponseUtil.wrapOrNotFound(schoolDTO);
        } else {
            return ResponseUtils.buildResponseBadRequest1("school_not_exists");
        }
    }

    @PostMapping(value = "/update-by-code", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<SchoolDTO> updateSchool(
        @RequestPart("dto") SchoolDTO schoolDTO,
        @RequestPart(value = "logo", required = false) MultipartFile logo
    ) {
        try {
            // Lay password, passwordHash
            School schoolOld = schoolRepository.findSchoolByCode(schoolDTO.getCode());
            schoolDTO.setHashPassword(schoolOld.getHashPassword());
            schoolDTO.setPassword(schoolOld.getPassword());
            ServiceResult<SchoolDTO> result = schoolService.updateSchool(schoolDTO, logo);
            if (result.getStatus() != HttpStatus.OK) {
                return ResponseUtils.buildResponseBadRequest1(result.getMessage());
            }
            return ResponseEntity.ok(result.getData());
        } catch (Exception ex) {
            return ResponseUtils.buildResponseBadRequest(ex.getMessage());
        }

    }

    @GetMapping("/get-school-and-package/{code}")
    public ResponseEntity<SchoolDTO> getSchoolAndPackageByCode(@PathVariable String code) {
        log.debug("REST request to get School : {}", code);
        Optional<SchoolDTO> schoolDTO = schoolService.findOne(code);
        DataPackageDTO dataPackageDTO = new DataPackageDTO();
        if (schoolDTO.isPresent()) {
            List<DataPackageDTO> lst = schoolService.getRecruivePackage(schoolDTO.get().getDataPackageCode());
            for (DataPackageDTO dto : lst) {
                if (StringUtils.isBlank(dto.getPrimaryPackage())) {
                    dataPackageDTO = dto;
                    lst.remove(dto);
                    break;
                }
            }
            dataPackageDTO.setChildPackage(lst);
            schoolDTO.get().setSchoolPackage(dataPackageDTO);
            return ResponseUtil.wrapOrNotFound(schoolDTO);
        } else {
            return ResponseUtils.buildResponseBadRequest1("school_not_exists");
        }
    }
}
