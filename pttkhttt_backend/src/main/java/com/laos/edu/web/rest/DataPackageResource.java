package com.laos.edu.web.rest;

import com.laos.edu.commons.ExportUtils;
import com.laos.edu.commons.Translator;
import com.laos.edu.domain.AppParam;
import com.laos.edu.domain.DataPackage;
import com.laos.edu.repository.DataPackageRepository;
import com.laos.edu.service.DataPackageService;
import com.laos.edu.service.dto.*;
import com.laos.edu.web.rest.errors.BadRequestAlertException;

import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.laos.edu.domain.DataPackage}.
 */
@RestController
@RequestMapping("/api")
public class DataPackageResource {

    private final Logger log = LoggerFactory.getLogger(DataPackageResource.class);

    private static final String ENTITY_NAME = "dataPackage";

    private final ExportUtils exportUtils;
    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DataPackageService dataPackageService;

    private final DataPackageRepository dataPackageRepository;

    public DataPackageResource(ExportUtils exportUtils, DataPackageService dataPackageService, DataPackageRepository dataPackageRepository) {
        this.exportUtils = exportUtils;
        this.dataPackageService = dataPackageService;
        this.dataPackageRepository = dataPackageRepository;
    }

    /**
     * {@code POST  /data-packages} : Create a new dataPackage.
     *
     * @param dataPackageDTO the dataPackageDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dataPackageDTO, or with status {@code 400 (Bad Request)} if the dataPackage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
//    @PostMapping("/data-packages")
//    public ResponseEntity<DataPackageDTO> createDataPackage(@RequestBody DataPackageDTO dataPackageDTO) throws URISyntaxException {
//        log.debug("REST request to save DataPackage : {}", dataPackageDTO);
//        if (dataPackageDTO.getId() != null) {
//            throw new BadRequestAlertException("A new dataPackage cannot already have an ID", ENTITY_NAME, "idexists");
//        }
//        DataPackageDTO result = dataPackageService.save(dataPackageDTO);
//        return ResponseEntity
//            .created(new URI("/api/data-packages/" + result.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
//            .body(result);
//    }

    @PostMapping("/data_packages/create")
    public ResponseEntity<?> createDataPackage(@RequestBody DataPackageDTO dataPackageDTO) throws URISyntaxException {
        log.debug("REST request to save DataPackage : {}", dataPackageDTO);
        if (dataPackageDTO.getId() != null) {
            throw new BadRequestAlertException("A new dataPackage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceResult<DataPackageDTO> res =  dataPackageService.save(dataPackageDTO);
        return ResponseEntity.ok().body(res);
    }

    /**
     * {@code PUT  /data-packages/:id} : Updates an existing dataPackage.
     *
     * @param id the id of the dataPackageDTO to save.
     * @param dataPackageDTO the dataPackageDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataPackageDTO,
     * or with status {@code 400 (Bad Request)} if the dataPackageDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dataPackageDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
//    @PutMapping("/data-packages/{id}")
//    public ResponseEntity<DataPackageDTO> updateDataPackage(
//        @PathVariable(value = "id", required = false) final Long id,
//        @RequestBody DataPackageDTO dataPackageDTO
//    ) throws URISyntaxException {
//        log.debug("REST request to update DataPackage : {}, {}", id, dataPackageDTO);
//        if (dataPackageDTO.getId() == null) {
//            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
//        }
//        if (!Objects.equals(id, dataPackageDTO.getId())) {
//            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
//        }
//
//        if (!dataPackageRepository.existsById(id)) {
//            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
//        }
//
//        DataPackageDTO result = dataPackageService.save(dataPackageDTO);
//        return ResponseEntity
//            .ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dataPackageDTO.getId().toString()))
//            .body(result);
//    }

    /**
     * {@code PATCH  /data-packages/:id} : Partial updates given fields of an existing dataPackage, field will ignore if it is null
     *
     * @param dataPackageDTO the dataPackageDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataPackageDTO,
     * or with status {@code 400 (Bad Request)} if the dataPackageDTO is not valid,
     * or with status {@code 404 (Not Found)} if the dataPackageDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the dataPackageDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
//    @PatchMapping(value = "/data-packages/{id}", consumes = "application/merge-patch+json")
//    public ResponseEntity<DataPackageDTO> partialUpdateDataPackage(
//        @PathVariable(value = "id", required = false) final Long id,
//        @RequestBody DataPackageDTO dataPackageDTO
//    ) throws URISyntaxException {
//        log.debug("REST request to partial update DataPackage partially : {}, {}", id, dataPackageDTO);
//        if (dataPackageDTO.getId() == null) {
//            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
//        }
//        if (!Objects.equals(id, dataPackageDTO.getId())) {
//            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
//        }
//
//        if (!dataPackageRepository.existsById(id)) {
//            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
//        }
//
//        Optional<DataPackageDTO> result = dataPackageService.partialUpdate(dataPackageDTO);
//
//        return ResponseUtil.wrapOrNotFound(
//            result,
//            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dataPackageDTO.getId().toString())
//        );
//    }
    @PostMapping(value = "/data_packages/checkUpdate")
    public ResponseEntity<?> getValidateUpdate(
        @RequestBody DataPackageDTO dataPackageDTO
    ) throws URISyntaxException {
        log.debug("REST request to check update DataPackage partially : {}",dataPackageDTO);
        if (dataPackageDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ServiceResult<List<Boolean>> returnResult =  dataPackageService.checkUpdate(dataPackageDTO);
        return ResponseEntity.ok().body(returnResult);
    }
    @PostMapping(value = "/data_packages/update")
    public ResponseEntity<?> partialUpdateDataPackage(
        @RequestBody DataPackageDTO dataPackageDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update DataPackage partially : {}",dataPackageDTO);
        if (dataPackageDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        //boolean isCheck  = !dataPackageService.isCheckAssignedForUpdatePrimaryPackage(dataPackageDTO);
        //Optional<DataPackageDTO> rs = dataPackageService.findOne(dataPackageDTO.getId());
        ServiceResult<DataPackageDTO> res = new ServiceResult<>();
//        if(rs.isPresent()){
//            if(rs.get().getPrimaryPackage() != null && isCheck){
//                res.setMessage(Translator.toLocale("data_package.update.failed.assign.dependency"));
//                res.setStatus(HttpStatus.BAD_REQUEST);
//                return ResponseEntity.ok().body(res);
//            }
//        }
        Optional<DataPackageDTO> result = dataPackageService.partialUpdate(dataPackageDTO);
        if(!result.isPresent()){
            res.setMessage(Translator.toLocale("data_package.duplicate_semesterApply_update"));
            res.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return ResponseEntity.ok().body(res);
        }
        res.setMessage(Translator.toLocale("data_package.update.success"));
        res.setStatus(HttpStatus.OK);
        res.setData(result.get());

        return ResponseEntity.ok().body(res);
    }

    /**
     * {@code GET  /data-packages} : get all the dataPackages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dataPackages in body.
     */
    @GetMapping("/data-packages")
    public ResponseEntity<List<DataPackageDTO>> getAllDataPackages(Pageable pageable) {
        log.debug("REST request to get a page of DataPackages");
        Page<DataPackageDTO> page = dataPackageService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /data-packages/:id} : get the "id" dataPackage.
     *
     * @param id the id of the dataPackageDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dataPackageDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/data-packages/{id}")
    public ResponseEntity<DataPackageDTO> getDataPackage(@PathVariable Long id) {
        log.debug("REST request to get DataPackage : {}", id);
        Optional<DataPackageDTO> dataPackageDTO = dataPackageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(dataPackageDTO);
    }

    /**
     * {@code DELETE  /data-packages/:id} : delete the "id" dataPackage.
     *
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PostMapping("/data_packages/delete")
    public ServiceResult<?> deleteDataPackage(@RequestBody DataPackageDTO dataPackageDTO) {
        log.debug("REST request to delete DataPackage : {}", dataPackageDTO);

           ServiceResult<DataPackageDTO> returnResult =  dataPackageService.delete(dataPackageDTO);
        return returnResult;
    }

    @PostMapping("data_packages/search")
    public ResponseEntity<?> getDataPackages(@RequestBody(required = false) DataPackageDTO dataPackageDTO,
                                             @RequestParam(value = "page", defaultValue = "1") int page,
                                             @RequestParam(value = "pageSize", defaultValue ="10") int pageSize) throws URISyntaxException {
        log.debug("REST request to search data package : {}",dataPackageDTO);
        DataPackageResultDTO result = dataPackageService.searchDataPackages(dataPackageDTO,page,pageSize);
        return ResponseEntity.ok().body(result);
    }


    // Export Excel

    @PostMapping("data_packages/exportExcel")
    public ResponseEntity<?> exportExcel(@RequestBody DataPackageDTO dataPackageDTO) throws Exception{
        List<DataPackageDTO> listExport = dataPackageService.getListExport(dataPackageDTO);
        List<ExcelColumn>  listColumn = buildColumnExport();
        String title = Translator.toLocale("data_package.title.export");
        ExcelTitle excelTitle = new ExcelTitle(title,"","");
        ByteArrayInputStream byteArrayInputStream = exportUtils.onExport(listColumn,listExport,3,0,excelTitle,true);
        InputStreamResource resource = new InputStreamResource(byteArrayInputStream);
        return ResponseEntity.ok()
            .contentLength(byteArrayInputStream.available())
            .contentType(MediaType.parseMediaType("application/octet-stream"))
            .body(resource);
    }
    @GetMapping("/data-packages/getByLevelSchool")
    public ResponseEntity<List<DataPackage>> getAllByLevelSchool(@RequestParam(value = "levelSchool") String levelSchool){
        List<DataPackage> list = dataPackageRepository.getAllByLevelSchool(levelSchool);
        return ResponseEntity.ok().body(list);
    }
    private List<ExcelColumn> buildColumnExport() {
        List<ExcelColumn> listColumn = new ArrayList<>();
        listColumn.add(new ExcelColumn("code", Translator.toLocale("data_package.column.code"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("name", Translator.toLocale("data_package.column.name"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("dataPackageTypeName", Translator.toLocale("data_package.column.data_package_type_name"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("primaryPackage", Translator.toLocale("data_package.column.primary_package"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("levelSchoolName", Translator.toLocale("data_package.column.level_school"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("quantitySemesterApply", Translator.toLocale("data_package.column.quantity_semester_apply"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("serviceName", Translator.toLocale("data_package.column.service"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("prices", Translator.toLocale("data_package.column.price"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("unit", Translator.toLocale("data_package.column.unit"), ExcelColumn.ALIGN_MENT.LEFT));
        listColumn.add(new ExcelColumn("quantitySms", Translator.toLocale("data_package.column.quantity_sms"), ExcelColumn.ALIGN_MENT.LEFT));
        return listColumn;
    }


    @GetMapping("/dataPackage/getAll")
    public ResponseEntity<?> getAll(){
        List<DataPackage> list = dataPackageRepository.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/data_packages/getData")
    public List<AppParam> getListDocumentType(@RequestParam String type){
        return dataPackageService.findAllByType(type);
    }

    @PostMapping("/data_packages/primaryPackage/{id}")
    public ResponseEntity<?> getListprimaryPackage(@PathVariable Long id){
        return ResponseEntity.ok().body(dataPackageService.getListPrimary(id));
    }
    // Report
    @PostMapping("/reports/data_packages")
    public ResponseEntity<?> reportsDataPackages(@RequestBody String search){
        return ResponseEntity.ok().body(dataPackageService.reportDataPackage());
    }

    // Lấy list theo levelschool
    @GetMapping("/data_packages/level_school")
    public ResponseEntity<?> geAllByLevelSchool(@RequestParam(value = "levelSchool") String levelSchool){
        return ResponseEntity.ok().body(dataPackageService.getAllByLevelSchool(levelSchool));
    }


    @PostMapping("/packageStatistics/search")
    public ResponseEntity<?> searchPackageStatistics(@RequestBody PackageStatisticsDTO packageStatisticsDTO) {
        return ResponseEntity.ok().body(dataPackageService.searchPackageStatistics(packageStatisticsDTO));
    }

    @PostMapping("/packageStatistics/monthlyPackageStatistics")
    public ResponseEntity<?> monthlyPackageStatistics(@RequestBody PackageStatisticsDTO packageStatisticsDTO) {
        return ResponseEntity.ok().body(dataPackageService.monthlyPackageStatistics(packageStatisticsDTO));
    }


    //check Exists code
    @PostMapping("/data_packages/checkExist")
    public ResponseEntity<?> checkExistDataPackage(@RequestBody DataPackageDTO dataPackageDTO){
        return ResponseEntity.ok().body(dataPackageService.checkExistDataPackage(dataPackageDTO.getCode()));
    }


    @PostMapping("/data_packages/report_2")
    public ResponseEntity<?> report2(@RequestBody PackageStatisticsDTO packageStatisticsDTO) {
        return ResponseEntity.ok().body(dataPackageService.report(packageStatisticsDTO));
    }


    @PostMapping("/data_packages/exportPackageStatistics")
    public ResponseEntity<?> exportPackageStatistics(@RequestBody PackageStatisticsDTO packageStatisticsDTO) throws Exception {

       ServiceResult<?> dataResponse = dataPackageService.searchPackageStatistics(packageStatisticsDTO);

        List<PackageStatisticsReturnDTO> listData = (List<PackageStatisticsReturnDTO>) dataResponse.getData();

        String title = Translator.toLocale("_titleExportPackageStatistics");

        String year = Translator.toLocale("__year")+" "+String.valueOf(packageStatisticsDTO.getYear());
        if(packageStatisticsDTO.getMonth()!=0){
            year = Translator.toLocale("_month")+" "+ packageStatisticsDTO.getMonth()+"/"+packageStatisticsDTO.getYear();
        }

        if(packageStatisticsDTO.getQuarters()!=0){
            if(packageStatisticsDTO.getQuarters() ==1){
                year = Translator.toLocale("_quarter")+" "+ "I"+"/"+packageStatisticsDTO.getYear();
            }
            if(packageStatisticsDTO.getQuarters() ==2){
                year = Translator.toLocale("_quarter")+" "+ "II"+"/"+packageStatisticsDTO.getYear();
            }
            if(packageStatisticsDTO.getQuarters() ==3){
                year = Translator.toLocale("_quarter")+" "+ "III"+"/"+packageStatisticsDTO.getYear();
            }
            if(packageStatisticsDTO.getQuarters() ==4){
                year = Translator.toLocale("_quarter")+" "+ "IV"+"/"+packageStatisticsDTO.getYear();
            }

        }

        ByteArrayInputStream byteArrayInputStream = exportUtils.exportPackageStatistics(listData,title,year);
        InputStreamResource resource = new InputStreamResource(byteArrayInputStream);
        return ResponseEntity.ok()
            .contentLength(byteArrayInputStream.available())
            .contentType(MediaType.parseMediaType("application/octet-stream"))
            .body(resource);

    }

    @GetMapping("/dataPackage/getDataPackageLimit50")
    public ResponseEntity<?> getDataPackageLimit50(String codeOrName){
        List<DataPackage> list = dataPackageService.findDataPackageByCodeOrNameLimit50(codeOrName);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/dataPackage/service-provided")
    public ResponseEntity<String> getDataPackageByCode(@RequestParam String code){
        DataPackage dataPackage = dataPackageService.findByCode(code);
        return ResponseEntity.ok().body(dataPackage.getService());
    }

}
