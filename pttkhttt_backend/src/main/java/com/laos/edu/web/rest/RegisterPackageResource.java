package com.laos.edu.web.rest;

import com.laos.edu.commons.ExportUtils;
import com.laos.edu.commons.ResponseUtils;
import com.laos.edu.commons.Translator;
import com.laos.edu.config.Constants;
import com.laos.edu.domain.AppParam;
import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.domain.RegisterPackageDetails;
import com.laos.edu.repository.RegisterPackageDetailsRepository;
import com.laos.edu.repository.RegisterPackageRepository;
import com.laos.edu.service.RegisterPackageService;
import com.laos.edu.service.dto.*;
import com.laos.edu.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.laos.edu.domain.RegisterPackage}.
 */
@RestController
@RequestMapping("/api")
public class RegisterPackageResource {

    private final Logger log = LoggerFactory.getLogger(RegisterPackageResource.class);

    private static final String ENTITY_NAME = "registerPackage";

    @Autowired
    private ExportUtils exportUtils;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegisterPackageService registerPackageService;

    @Autowired
    private RegisterPackageDetailsRepository registerPackageDetailsRepository;

    @Autowired
    private RegisterPackageRepository registerPackageRepository;

    public RegisterPackageResource(RegisterPackageService registerPackageService) {
        this.registerPackageService = registerPackageService;
    }

    /**
     * {@code POST  /register-packages} : Create a new registerPackage.
     *
     * @param registerPackageDTO the registerPackageDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registerPackageDTO, or with status {@code 400 (Bad Request)} if the registerPackage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/register-packages")
    public ResponseEntity<RegisterPackageDTO> createRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
        if (registerPackageDTO.getId() != null) {
            throw new BadRequestAlertException("A new registerPackage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RegisterPackageDTO result = registerPackageService.save(registerPackageDTO);
        return ResponseEntity.created(new URI("/api/register-packages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /register-packages} : Updates an existing registerPackage.
     *
     * @param registerPackageDTO the registerPackageDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registerPackageDTO,
     * or with status {@code 400 (Bad Request)} if the registerPackageDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the registerPackageDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/register-packages")
    public ResponseEntity<RegisterPackageDTO> updateRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
        log.debug("REST request to update RegisterPackage : {}", registerPackageDTO);
        if (registerPackageDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        RegisterPackageDTO result = registerPackageService.save(registerPackageDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registerPackageDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /register-packages} : get all the registerPackages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of registerPackages in body.
     */
    @GetMapping("/register-packages")
    public ResponseEntity<List<RegisterPackageDTO>> getAllRegisterPackages(Pageable pageable) {
        log.debug("REST request to get a page of RegisterPackages");
        Page<RegisterPackageDTO> page = registerPackageService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /register-packages/:id} : get the "id" registerPackage.
     *
     * @param id the id of the registerPackageDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the registerPackageDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/register-packages/{id}")
    public ResponseEntity<RegisterPackageDTO> getRegisterPackage(@PathVariable Long id) {
        log.debug("REST request to get RegisterPackage : {}", id);
        Optional<RegisterPackageDTO> registerPackageDTO = registerPackageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(registerPackageDTO);
    }

    /**
     * {@code DELETE  /register-packages/:id} : delete the "id" registerPackage.
     *
     * @param id the id of the registerPackageDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/register-packages/{id}")
    public ResponseEntity<Void> deleteRegisterPackage(@PathVariable Long id) {
        log.debug("REST request to delete RegisterPackage : {}", id);
        registerPackageService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }


    @GetMapping("/register-packages/getAll")
    public ResponseEntity<?> getAll(){
        List<RegisterPackage> list = registerPackageRepository.findAll();
        return ResponseEntity.ok().body(list);
    }


//    @PostMapping("/register-packages/add")
//    public ResponseEntity<?>addRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
//        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
//        if (registerPackageDTO.getId() != null) {
//            throw new BadRequestAlertException("A new registerPackage cannot already have an ID", ENTITY_NAME, "idexists");
//        }
//        ServiceResult<RegisterPackageDTO> result = registerPackageService.saveRegisterPackage(registerPackageDTO);
//        return ResponseEntity.ok().body(result);
//    }
//
//    @PostMapping("/register-packages/cancel")
//    public ResponseEntity<?>cancelRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
//        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
//        ServiceResult<RegisterPackageDTO> result = registerPackageService.cancelRegisterPackage(registerPackageDTO);
//        return ResponseEntity.ok().body(result);
//    }
//
//    @PostMapping("/register-packages/history")
//    public ResponseEntity<?>getHistoryRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
//        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
//        ServiceResult<List<RegisterPackageDTO>> result = registerPackageService.getHistoryRegisterPackage(registerPackageDTO);
//        return ResponseEntity.ok().body(result);
//    }


    @PostMapping("/register-packages/searchManagementRegistration")
    public ResponseEntity<?>searchManagementRegistration(@RequestBody ManagementRegistrationDTO managementRegistrationDTO) throws URISyntaxException {
        log.debug("Search ManagementRegistration", managementRegistrationDTO);
        ManagementRegistrationResultDTO result = registerPackageService.searchManagementRegistration(managementRegistrationDTO);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/register-packages/history")
    public ResponseEntity<?>getHistoryRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
        ServiceResult<RegisterHistoryDTO> result = registerPackageService.getHistoryRegisterPackage(registerPackageDTO);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/register-packages/export")
    public ResponseEntity<?> export(@RequestBody ManagementRegistrationDTO managementRegistrationDTO) throws Exception {

        managementRegistrationDTO.setPage(null);
        managementRegistrationDTO.setPageSize(null);
        ManagementRegistrationResultDTO result = registerPackageService.searchManagementRegistration(managementRegistrationDTO);

        List<ManagementRegistrationDTO> lstDatas = result.getManagementRegistrationDTOS();
        ;
        String title = Translator.toLocale("_titleRegister");

        ByteArrayInputStream byteArrayInputStream = exportUtils.onExportRegisterPackage(lstDatas,title);
        InputStreamResource resource = new InputStreamResource(byteArrayInputStream);
        return ResponseEntity.ok()
            .contentLength(byteArrayInputStream.available())
            .contentType(MediaType.parseMediaType("application/octet-stream"))
            .body(resource);
    }

    @PostMapping("/register-packages/active")
    public ResponseEntity<?>activeRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO) throws URISyntaxException {
        log.debug("REST request to save RegisterPackage : {}", registerPackageDTO);
        ServiceResult<String> result = registerPackageService.activeRegisterPackage(registerPackageDTO);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/register-packages/get-data-statistical")
    public RegisterPackageDetailsDTO getDataStatistical(
            @RequestBody RegisterPackageDetailsDTO registerPackageDetails
    ) throws URISyntaxException {
        return this.registerPackageDetailsRepository.getStatistical(registerPackageDetails);
    }

    @PostMapping("/register-packages/get-details-data")
    public Page<RegisterPackageDetailsDTO> getDetailData(
            @RequestBody RegisterPackageDetailsDTO registerPackageDetails,
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") final int size
    ) throws URISyntaxException {
        return this.registerPackageDetailsRepository.getDetailsData(registerPackageDetails,page,size);
    }

    @PostMapping("/report-package/export")
    public ResponseEntity<?> export(@RequestBody final RegisterPackageDetailsDTO registerPackageDetails) throws Exception {
        RegisterReportDTO lstDatas = registerPackageDetailsRepository.getData(registerPackageDetails);
         String title = Translator.toLocale("rp.title");
         ExcelTitle excelTitle = new ExcelTitle(title, null, registerPackageDetails.getTitle());
         List<ExcelColumn> lstColumn = buildColumnExportReports();
         ByteArrayInputStream byteArrayInputStream =
                this.exportUtils.onExportReportPrice(lstColumn,lstDatas, 18, 0, excelTitle, true);
         InputStreamResource resource = new InputStreamResource(byteArrayInputStream);
        return ResponseEntity
                .ok()
                .contentLength(byteArrayInputStream.available())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }

    private List<ExcelColumn> buildColumnExportReports() {
        List<ExcelColumn> lstColumn = new ArrayList<>();
        lstColumn.add(new ExcelColumn("dataPackageName", Translator.toLocale("rp.package"), ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("registerBegin", Translator.toLocale("rp.register"), ExcelColumn.ALIGN_MENT.CENTER, 5000));
        lstColumn.add(new ExcelColumn("cancelBegin", Translator.toLocale("rp.cancel"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("sumBeginPrice", Translator.toLocale("rp.price.begin"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("registerCurrent", Translator.toLocale("rp.register"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("cancelCurrent", Translator.toLocale("rp.cancel"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("sumCurrentPrice", Translator.toLocale("rp.price.current"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("registerEnd", Translator.toLocale("rp.register"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("cancelEnd", Translator.toLocale("rp.cancel"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("countActiveEnd", Translator.toLocale("rp.active.end"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("sumPriceEnd", Translator.toLocale("rp.active.end"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("ratioGrowthUser", Translator.toLocale("rp.user"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        lstColumn.add(new ExcelColumn("ratioGrowthPrice", Translator.toLocale("rp.price"), ExcelColumn.ALIGN_MENT.CENTER,5000));
        return lstColumn;
    }

    @PostMapping("/register-packages/cancelRegisterPackageExpired")
    public ResponseEntity<?> cancelRegisterPackageExpired(){
//        return ResponseEntity.ok(registerPackageService.cancelRegisterPackageExpired());
//        return ResponseEntity.ok(registerPackageService.cancelRegisterPackageExpired());
        return null;
    }
}
