package com.laos.edu.web.rest;

import com.laos.edu.commons.ExportUtils;
import com.laos.edu.commons.Translator;
import com.laos.edu.domain.AppParam;
import com.laos.edu.domain.DataPackage;
import com.laos.edu.repository.DataPackageRepository;
import com.laos.edu.service.DataPackageService;
import com.laos.edu.service.dto.*;
import com.laos.edu.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import java.io.ByteArrayInputStream;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link DataPackage}.
 */
@RestController
@RequestMapping("/school-api/api")
public class DataPackageApiResource {

    private final Logger log = LoggerFactory.getLogger(DataPackageApiResource.class);

    private static final String ENTITY_NAME = "dataPackage";

    private final ExportUtils exportUtils;
    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DataPackageService dataPackageService;

    private final DataPackageRepository dataPackageRepository;

    public DataPackageApiResource(ExportUtils exportUtils, DataPackageService dataPackageService, DataPackageRepository dataPackageRepository) {
        this.exportUtils = exportUtils;
        this.dataPackageService = dataPackageService;
        this.dataPackageRepository = dataPackageRepository;
    }

    @PostMapping("/dataPackage/getListByCode")
    public ResponseEntity<?>getListDataPackageNameByCode(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
        ServiceResult<?> result = dataPackageService.getListDataPackageByCode(registerPackageDTO);
        return ResponseEntity.ok().body(result);
    }
}
