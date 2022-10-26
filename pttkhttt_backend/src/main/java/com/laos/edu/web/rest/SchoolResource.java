package com.laos.edu.web.rest;

import com.laos.edu.commons.ExportUtils;
import com.laos.edu.commons.Translator;
import com.laos.edu.domain.School;
import com.laos.edu.repository.SchoolRepository;
import com.laos.edu.service.SchoolService;
import com.laos.edu.service.dto.*;
import com.laos.edu.web.rest.errors.BadRequestAlertException;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
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

/**
 * REST controller for managing {@link com.laos.edu.domain.School}.
 */
@RestController
@RequestMapping("/api")
public class SchoolResource {

    private final Logger log = LoggerFactory.getLogger(SchoolResource.class);

    private static final String ENTITY_NAME = "school";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SchoolService schoolService;

    private final SchoolRepository schoolRepository;

    private final ExportUtils exportUtils;

    public SchoolResource(SchoolService schoolService, SchoolRepository schoolRepository, ExportUtils exportUtils) {
        this.schoolService = schoolService;
        this.schoolRepository = schoolRepository;
        this.exportUtils = exportUtils;
    }

    /**
     * {@code POST  /schools} : Create a new school.
     *
     * @param schoolDTO the schoolDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new schoolDTO, or with status {@code 400 (Bad Request)} if the school has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/schools")
    public ResponseEntity<SchoolDTO> createSchool(@RequestBody SchoolDTO schoolDTO) throws URISyntaxException {
        log.debug("REST request to save School : {}", schoolDTO);
        if (schoolDTO.getId() != null) {
            throw new BadRequestAlertException("A new school cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SchoolDTO result = schoolService.save(schoolDTO);
        return ResponseEntity
            .created(new URI("/api/schools/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /schools/:id} : Updates an existing school.
     *
     * @param id the id of the schoolDTO to save.
     * @param schoolDTO the schoolDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated schoolDTO,
     * or with status {@code 400 (Bad Request)} if the schoolDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the schoolDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/schools/{id}")
    public ResponseEntity<SchoolDTO> updateSchool(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SchoolDTO schoolDTO
    ) throws URISyntaxException {
        log.debug("REST request to update School : {}, {}", id, schoolDTO);
        if (schoolDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, schoolDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!schoolRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SchoolDTO result = schoolService.save(schoolDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, schoolDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /schools/:id} : Partial updates given fields of an existing school, field will ignore if it is null
     *
     * @param id the id of the schoolDTO to save.
     * @param schoolDTO the schoolDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated schoolDTO,
     * or with status {@code 400 (Bad Request)} if the schoolDTO is not valid,
     * or with status {@code 404 (Not Found)} if the schoolDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the schoolDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/schools/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SchoolDTO> partialUpdateSchool(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SchoolDTO schoolDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update School partially : {}, {}", id, schoolDTO);
        if (schoolDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, schoolDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!schoolRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SchoolDTO> result = schoolService.partialUpdate(schoolDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, schoolDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /schools} : get all the schools.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of schools in body.
     */
    @GetMapping("/schools")
    public ResponseEntity<List<SchoolDTO>> getAllSchools(Pageable pageable) {
        log.debug("REST request to get a page of Schools");
        Page<SchoolDTO> page = schoolService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * lay thong tin truong theo ma
     * @param code
     * @return
     */
    @GetMapping("/schools/{code}")
    public ResponseEntity<SchoolDTO> getSchoolByCode(@PathVariable String code) {
        log.debug("REST request to get School : {}", code);
        Optional<SchoolDTO> schoolDTO = schoolService.findOne(code);
        return ResponseUtil.wrapOrNotFound(schoolDTO);
    }

    // When click in area of Province call this method
    @GetMapping("/getSchoolsByProvinceId/{id}")
    public ResponseEntity<List<SchoolDTO>> getSchoolsByProvinceId(@PathVariable Long id) {
        log.debug("REST request go get School By Province ID: {}", id);
        List<SchoolDTO> listSchoolDto = schoolService.findAllByProvinceId(id, 1L);
        return ResponseEntity.ok(listSchoolDto);
    }

    /**
     * {@code DELETE  /schools/:id} : delete the "id" school.
     *
     * @param id the id of the schoolDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/schools/{id}")
    public ResponseEntity<Void> deleteSchool(@PathVariable Long id) {
        log.debug("REST request to delete School : {}", id);
        schoolService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/schools/getAll")
    public ResponseEntity<?> getAll() {
        List<School> list = schoolRepository.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/schools/getSchoolHasLimit50")
    public ResponseEntity<?> getSchoolHasLimit50(String codeOrName) {
        List<School> list = schoolService.findSchoolByCodeOrNameLimit50(codeOrName);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/schools/getSchoolCustom/{codeOrName}")
    public ResponseEntity<?> getSchoolCustom(@PathVariable String codeOrName) {
        List<SchoolCustomDTO> list = schoolService.getSchoolCustom(codeOrName);

        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/schools/getSchoolCustom")
    public ResponseEntity<?> getSchoolCustom20() {
        List<SchoolCustomDTO> list = schoolService.getSchoolLimit20();

        return ResponseEntity.ok().body(list);
    }

    @PostMapping("/schools/search")
    public ResponseEntity<?> search(
        @RequestBody SearchSchoolDTO searchSchoolDTO,
        @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
        @RequestParam(value = "page-size", required = false, defaultValue = "10") Integer pageSize
    ) {
        Map<String, Object> result = schoolService.search(searchSchoolDTO, page, pageSize);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/schools/export")
    public ResponseEntity<?> export(@RequestBody SearchSchoolDTO searchSchoolDTO) throws Exception {
        List<SchoolDTO> listData = schoolService.exportData(searchSchoolDTO);
        List<ExcelColumn> lstColumn = buildColumnExport();
        String title = Translator.toLocale("school.export.title");
        ExcelTitle excelTitle = new ExcelTitle(title, "", "");
        ByteArrayInputStream byteArrayInputStream = exportUtils.onExport(lstColumn, listData, 3, 0, excelTitle, true);
        InputStreamResource resource = new InputStreamResource(byteArrayInputStream);
        return ResponseEntity
            .ok()
            .contentLength(byteArrayInputStream.available())
            .contentType(MediaType.parseMediaType("application/octet-stream"))
            .body(resource);
    }

    @GetMapping("/schools/findById")
    public ResponseEntity<?> getById(@RequestParam(value = "id") Long id) {
        School school = schoolRepository.findById(id).get();
        return ResponseEntity.ok().body(school);
    }

    @GetMapping("/schools/infor-school/{id}")
    public ResponseEntity<?> getInfor(@PathVariable Long id) {
        SchoolDTO schoolDTO = schoolService.getInfor(id);
        return ResponseEntity.ok().body(schoolDTO);
    }

    @GetMapping("/schools/getByCode/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        School school = schoolRepository.findSchoolByCode(code);
        return ResponseEntity.ok().body(school);
    }

    private List<ExcelColumn> buildColumnExport() {
        List<ExcelColumn> lstColumn = new ArrayList<>();
        lstColumn.add(new ExcelColumn("code", Translator.toLocale("school.export.code"), ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("name", Translator.toLocale("school.export.name"), ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(
            new ExcelColumn("abbreviationName", Translator.toLocale("school.export.abbreviationName"), ExcelColumn.ALIGN_MENT.LEFT)
        );
        lstColumn.add(
            new ExcelColumn("levelSchoolName", Translator.toLocale("school.export.levelSchoolName"), ExcelColumn.ALIGN_MENT.LEFT)
        );
        lstColumn.add(new ExcelColumn("provinceName", Translator.toLocale("school.export.provinceName"), ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(
            new ExcelColumn("dataPackageName", Translator.toLocale("school.export.dataPackageName"), ExcelColumn.ALIGN_MENT.LEFT)
        );
        lstColumn.add(new ExcelColumn("statusStr", Translator.toLocale("school.export.statusStr"), ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("createDate", Translator.toLocale("school.export.createdTime"), ExcelColumn.ALIGN_MENT.LEFT));
        return lstColumn;
    }
}
