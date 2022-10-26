package com.laos.edu.web.rest;

import com.laos.edu.commons.ExportUtils;
import com.laos.edu.commons.Translator;
import com.laos.edu.domain.AppParam;
import com.laos.edu.domain.DataPackage;
import com.laos.edu.domain.School;
import com.laos.edu.repository.DataPackageRepository;
import com.laos.edu.repository.RegisterPackageDetailsRepository;
import com.laos.edu.repository.RegisterPackageRepository;
import com.laos.edu.repository.SchoolRepository;
import com.laos.edu.service.DataPackageService;
import com.laos.edu.service.RegisterPackageService;
import com.laos.edu.service.SchoolService;
import com.laos.edu.service.dto.*;
import com.laos.edu.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayInputStream;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api/clone")
public class CloneDataResource {

    private final Logger log = LoggerFactory.getLogger(DataPackageResource.class);

    private static final String ENTITY_NAME = "dataPackage";

    //    private final ExportUtils exportUtils;
    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    ExportUtils exportUtils;

    @Autowired
    DataPackageService dataPackageService;

    @Autowired
    DataPackageResource dataPackageResource;

    @Autowired
    DataPackageRepository dataPackageRepository;

    @Autowired
    RegisterPackageDetailsRepository registerPackageDetailsRepository;

    @Autowired
    SchoolService schoolService;

    @Autowired
    SchoolRepository schoolRepository;

    @Autowired
    RegisterPackageService registerPackageService;

    public CloneDataResource() {}

    @PostMapping("data_packages/search")
    public ResponseEntity<?> getDataPackages(
        @RequestBody(required = false) DataPackageDTO dataPackageDTO,
        @RequestParam(value = "page", defaultValue = "1") int page,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize
    ) throws URISyntaxException {
        log.debug("REST request to search data package : {}", dataPackageDTO);
        DataPackageResultDTO result = dataPackageService.searchDataPackages(dataPackageDTO, page, pageSize);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/data_packages/report_2")
    public ResponseEntity<?> report2(@RequestBody PackageStatisticsDTO packageStatisticsDTO) {
        return ResponseEntity.ok().body(dataPackageService.report(packageStatisticsDTO));
    }

    @PostMapping("/register-packages/searchManagementRegistration")
    public ResponseEntity<?> searchManagementRegistration(@RequestBody ManagementRegistrationDTO managementRegistrationDTO)
        throws URISyntaxException {
        log.debug("Search ManagementRegistration", managementRegistrationDTO);
        ManagementRegistrationResultDTO result = registerPackageService.searchManagementRegistration(managementRegistrationDTO);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/register-packages/get-data-statistical")
    public RegisterPackageDetailsDTO getDataStatistical(@RequestBody RegisterPackageDetailsDTO registerPackageDetails)
        throws URISyntaxException {
        return this.registerPackageDetailsRepository.getStatistical(registerPackageDetails);
    }

    @PostMapping("/register-packages/get-details-data")
    public Page<RegisterPackageDetailsDTO> getDetailData(
        @RequestBody RegisterPackageDetailsDTO registerPackageDetails,
        @RequestParam(value = "page", defaultValue = "0") final int page,
        @RequestParam(value = "size", defaultValue = "10") final int size
    ) throws URISyntaxException {
        return this.registerPackageDetailsRepository.getDetailsData(registerPackageDetails, page, size);
    }
}
