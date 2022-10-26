package com.laos.edu.service.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.commons.StringUtils;
import com.laos.edu.commons.Translator;
import com.laos.edu.domain.AppParam;
import com.laos.edu.domain.DataPackage;
import com.laos.edu.domain.User;
import com.laos.edu.repository.*;
import com.laos.edu.service.DataPackageService;
import com.laos.edu.service.dto.*;
import com.laos.edu.service.mapper.AppParamMapper;
import com.laos.edu.service.mapper.DataPackageMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import javax.xml.crypto.Data;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link DataPackage}.
 */
@Service
@Transactional
public class DataPackageServiceImpl implements DataPackageService {

    private final Logger log = LoggerFactory.getLogger(DataPackageServiceImpl.class);

    private final DataPackageRepository dataPackageRepository;

    private final DataPackageMapper dataPackageMapper;

    private final DataPackageCustomRepository dataPackageCustomRepository;

    private final UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private AppParamRepository appParamRepository;

    @Autowired
    private PackageStatisticsCustomerRepository packageStatisticsCustomerRepository;

    @Autowired
    private AppParamMapper appParamMapper;

    public DataPackageServiceImpl(DataPackageRepository dataPackageRepository, DataPackageMapper dataPackageMapper, DataPackageCustomRepository dataPackageCustomRepository, UserRepository userRepository) {
        this.dataPackageRepository = dataPackageRepository;
        this.dataPackageMapper = dataPackageMapper;
        this.dataPackageCustomRepository = dataPackageCustomRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ServiceResult<DataPackageDTO> save(DataPackageDTO dataPackageDTO) {
        log.debug("Request to save DataPackage : {}", dataPackageDTO);
        if(dataPackageDTO.getListLevelSchool().size() >= 1)
            mergeLevelSchool(dataPackageDTO);
        if(dataPackageDTO.getListService().size() >=1)
            mergeService(dataPackageDTO);
        //LocalDateTime now = LocalDateTime.now();
        //Instant timeInstant = now.toInstant(ZoneOffset.UTC);
        dataPackageDTO.setCreatedTime(Instant.now());
        // Get Current username Login
        String userName = getCurrentUserNameLogin();
        User user = userRepository.findOneWithAuthoritiesByLogin(userName).get();
        dataPackageDTO.setCreatedName(user.getFullName());
        DataPackage dataPackage = dataPackageMapper.toEntity(dataPackageDTO);
        Optional<DataPackage> existData = dataPackageRepository.findByCode(dataPackageDTO.getCode());
        ServiceResult<DataPackageDTO> rs = new ServiceResult<>();
        if(existData.isPresent()){
            rs.setMessage(Translator.toLocale("data_package.create.exist_code"));
            rs.setStatus(HttpStatus.BAD_REQUEST);
            return rs;
        }
        if(dataPackageDTO.getTypePackage() == 0){
            List<DataPackageDTO> existSupportPackageHavePrimaryPackage= dataPackageCustomRepository.findPrimaryPackageBySupportPackage(dataPackageDTO);
            if(existSupportPackageHavePrimaryPackage.size() > 0){
                for(DataPackageDTO dataCheck : existSupportPackageHavePrimaryPackage){
                    // Check if duplicate Semester Apply And Quantity Semester Per Year.
                    if(dataPackageDTO.getSemesterApply().equals(dataCheck.getSemesterApply()) && dataPackageDTO.getQuantitySemesterApply().equals(dataCheck.getQuantitySemesterApply())){
                        rs.setMessage(Translator.toLocale("data_package.duplicate_semesterApply_create"));
                        rs.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
                        return rs;
                    }
                }
            }
        }
        dataPackageRepository.save(dataPackage);
        savePackagePrice(dataPackageDTO);
        rs.setMessage(Translator.toLocale("data_package.create.success"));
        rs.setStatus(HttpStatus.OK);
        return rs;
    }

    @Override
    public void savePackagePrice(DataPackageDTO dataPackageDTO) {
        log.debug("Request to save DataPackagePrice For : {}",dataPackageDTO);
        dataPackageCustomRepository.savePackagePrice(dataPackageDTO);

    }
    @Override
    public Optional<DataPackageDTO> partialUpdate(DataPackageDTO dataPackageDTO) {
        log.debug("Request to partially update DataPackage : {}", dataPackageDTO);
        ServiceResult<DataPackageDTO> rs = new ServiceResult<>();
        if(dataPackageDTO.getId() == null) throw new RuntimeException(Translator.toLocale("data_package.update.failed"));
        if(dataPackageDTO.getTypePackage() == 0){
            List<DataPackageDTO> existSupportPackageHavePrimaryPackage= dataPackageCustomRepository.findPrimaryPackageBySupportPackage(dataPackageDTO);
            if(existSupportPackageHavePrimaryPackage.size() > 0){
                for(DataPackageDTO dataCheck : existSupportPackageHavePrimaryPackage){
                    if(dataPackageDTO.getSemesterApply().equals(dataCheck.getSemesterApply()) && dataPackageDTO.getQuantitySemesterApply().equals(dataCheck.getQuantitySemesterApply())){
                        rs.setMessage(Translator.toLocale("data_package.duplicate_semesterApply_update"));
                        return Optional.empty();
                    }
                }
            }
        }
        dataPackageDTO.setCreatedTime(Instant.now());
        return dataPackageRepository
            .findById(dataPackageDTO.getId())
            .map(
                existingDataPackage -> {
                    mergeLevelSchool(dataPackageDTO);
                    mergeService(dataPackageDTO);
                    if( dataPackageDTO.getTypePackage() == 1L){
                        existingDataPackage.setPrimaryPackage(null);
                        existingDataPackage.setQuantitySemesterApply(null);
                        existingDataPackage.setSemesterApply(null);
                    }
                    dataPackageMapper.partialUpdate(existingDataPackage, dataPackageDTO);
                    savePackagePrice(dataPackageDTO);
                    return existingDataPackage;
                }
            )
            .map(dataPackageRepository::save)
            .map(dataPackageMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DataPackageDTO> findAll(Pageable pageable) {
        log.debug("Request to get all DataPackages");
        return dataPackageRepository.findAll(pageable).map(dataPackageMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DataPackageDTO> findOne(Long id) {
        log.debug("Request to get DataPackage : {}", id);
        return dataPackageRepository.findById(id).map(dataPackageMapper::toDto);
    }

    @Override
    public ServiceResult<DataPackageDTO> delete(DataPackageDTO dataPackageDTO) {
        log.debug("Request to delete DataPackage : {}", dataPackageDTO);

        // Check là gói cước chính có gói cước phụ mà gói cước phụ này được nhà trường đăng kí ==> Không thể xóa (Đang check sql)
        // 1. Check là gói chính
        // 2. Check có gói phụ
        boolean isPrimaryPackageHaveSupportPackage = dataPackageCustomRepository.checkDependency(dataPackageDTO);
        /* Check là gói cước chính đã được nhà trường đăng kí
           Check là gói cước phụ được nhà trường đăng kí
         */
        boolean isCheckAlreadyAssignForSchool  = dataPackageCustomRepository.checkAlreadyAssignForSchool(dataPackageDTO);


        // Check gói phụ được nhà trường đăng kí (tìm theo gói cước chính)
        //boolean isCheckSupportPackageAlreadyAssignForSchool = dataPackageCustomRepository.checkSupportPackageIsAssignedByPrimaryPackage(dataPackageDTO);

        /*
            Check gói cước phụ thuộc gói cước chính được nhà trường đăng kí
            (Gói cước chính này đã được nhà trường đăng kí ==> Không được xóa gói phụ)
        */
        boolean isCheckSupportPackageHavePrimaryPackageAssignedBySchool = dataPackageCustomRepository.checkSupportPackageHavePrimaryPackageAssignedBySchool(dataPackageDTO);

        // Tìm gói con phụ theo gói cước chính mà gói phụ này được nhà trường đăng kí

        Optional<DataPackage> dataPackage = dataPackageRepository.findById(dataPackageDTO.getId());
        ServiceResult<DataPackageDTO> result = new ServiceResult<>();
        // Case1: // 1. Check là gói chính được đăng ký
        //        // 2.Check được nhà trường đăng ký
        if( dataPackageDTO.getTypePackage() == 1 && !isCheckAlreadyAssignForSchool){
            result.setMessage(Translator.toLocale("data_package.delete.failed.assigned"));
            result.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return result;
        }
        // Case2:
        // 1. Là gói chính
        //2. Có gói phụ thuộc
        if( dataPackageDTO.getTypePackage() == 1 && !isPrimaryPackageHaveSupportPackage){
            result.setMessage(Translator.toLocale("data_package.delete.failed_dependency"));
            result.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return result;
        }
        //&& !isCheckAlreadyAssignForSchool
        // Case 2:
        // 1.Check là gói chính
        // 2.Check có gói phụ
        // 3.Và gói phụ này được nhà trường đăng kí()
//        if(dataPackageDTO.getTypePackage() == 1 && !isPrimaryPackageHaveSupportPackage && !isCheckSupportPackageAlreadyAssignForSchool){
//            result.setMessage(Translator.toLocale("data_package.delete.failed_dependency"));
//            result.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
//            return result;
//        }
        // Case3:
        //1. Là gói phụ
        //2. Được nhà trường đăng ký
//        if(dataPackageDTO.getTypePackage() == 0 && !isCheckAlreadyAssignForSchool){
//            result.setMessage(Translator.toLocale("data_package.delete.failed.assigned"));
//            result.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
//            return result;
//        }
        // Case 4:
        //1. Là gói  phụ
        //2. Thuộc gói cước chính
        //3. Mà gói cước chính được nhà trường đăng ký
        if(dataPackageDTO.getTypePackage() == 0  && !isCheckSupportPackageHavePrimaryPackageAssignedBySchool ){
            result.setMessage(Translator.toLocale("data_package.delete.support_have_primary_is_assigned_school"));
            result.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return result;
        }

        if(!dataPackage.isPresent()){
            result.setMessage(Translator.toLocale("data_package.delete.not_exist"));
            result.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            return result;
        }
        dataPackageRepository.deleteById(dataPackageDTO.getId());
        result.setMessage(Translator.toLocale("data_package.delete.success"));
        result.setStatus(HttpStatus.OK);
        return result;
    }

    @Override
    public DataPackageResultDTO searchDataPackages(DataPackageDTO dataPackageDTO, int page, int pageSize) {
        DataPackageResultDTO data = new DataPackageResultDTO();
        List<DataPackageDTO> listResult;

        try{
            listResult = dataPackageCustomRepository.searchDataPackages(dataPackageDTO,page,pageSize);
            for(DataPackageDTO dataPackage:listResult){
                Map<Long,String> mapPackageTypeToName = new HashMap<>();
                Map<Long,String> semesterApplyMap = new HashMap<>();
                if(dataPackage.getTypePackage() == 1L){
                    mapPackageTypeToName.put(dataPackage.getTypePackage(), Translator.toLocale("data_package.type.to.primary_name"));
                    dataPackage.setMapPackageTypeToName(mapPackageTypeToName);
                    dataPackage.setDataPackageTypeName(Translator.toLocale("data_package.type.to.primary_name"));
                }
                else if(dataPackage.getTypePackage() == 0L){
                    mapPackageTypeToName.put(dataPackage.getTypePackage(), Translator.toLocale("data_package.type.to.support_name"));
                    dataPackage.setMapPackageTypeToName(mapPackageTypeToName);
                    dataPackage.setDataPackageTypeName(Translator.toLocale("data_package.type.to.support_name"));
                }

                if (dataPackage.getQuantitySemesterApply() == null){

                }else if (dataPackage.getQuantitySemesterApply() == 1L) {
                    semesterApplyMap.put(1L, DataPackageEnum.HK1.getValue());
                    dataPackage.setQuantitySemesterApplyMap(semesterApplyMap);
                } else if (dataPackage.getQuantitySemesterApply() == 2) {
                    semesterApplyMap.put(1L, DataPackageEnum.HK1.getValue());
                    semesterApplyMap.put(2L, DataPackageEnum.HK2.getValue());
                    dataPackage.setQuantitySemesterApplyMap(semesterApplyMap);
                } else if (dataPackage.getQuantitySemesterApply() == 3) {
                    semesterApplyMap.put(1L, DataPackageEnum.HK1.getValue());
                    semesterApplyMap.put(2L, DataPackageEnum.HK2.getValue());
                    semesterApplyMap.put(3L, DataPackageEnum.HK3.getValue());
                    dataPackage.setQuantitySemesterApplyMap(semesterApplyMap);
                } else if (dataPackage.getQuantitySemesterApply() == 4) {
                    semesterApplyMap.put(1L, DataPackageEnum.HK1.getValue());
                    semesterApplyMap.put(2L, DataPackageEnum.HK2.getValue());
                    semesterApplyMap.put(3L, DataPackageEnum.HK3.getValue());
                    semesterApplyMap.put(4L, DataPackageEnum.HK4.getValue());
                    dataPackage.setQuantitySemesterApplyMap(semesterApplyMap);
                }
                dataPackage.setLanguageType(dataPackageDTO.getLanguageType());
                splitLevelSchoolInDBAndCombineName(dataPackage);
                splitServiceInDBAndCombineName(dataPackage);
//                if(dataPackage.getLevelSchool().contains(",")){
//
//                    String levelSchoolSplit = dataPackage.getLevelSchool();
//                    //dataPackage.setLevelSchool(levelSchoolSplit.substring(0,levelSchoolSplit.length()-1)); // Split the last ","
//                }

                dataPackage.setResponsePrice(dataPackage.getPrices().toString());

                dataPackage.setUnit(DataPackageEnum.USD.getValue());
            }
            data.setDataPackageDTOList(listResult);
            if(page > 0 && pageSize > 0){
                data.setPage(page);
                data.setPageSize(pageSize);
                data.setTotal(dataPackageCustomRepository.getTotalRecords(dataPackageDTO).intValue());
            }
            return data;
        }catch (Exception ex){
            log.error(ex.getMessage(), ex);
            return data;
        }
    }

    @Override
    public List<DataPackageDTO> getListExport(DataPackageDTO dataPackageDTO) {
        try{
            DataPackageResultDTO rs = searchDataPackages(dataPackageDTO,0,0);
            return rs.getDataPackageDTOList();
        }catch (Exception ex){
            log.error(ex.getMessage(), ex);
            return null;
        }
    }

    @Override
    public List<AppParam> findAllByType(String type) {
        return appParamRepository.findAppParamByType(type);
    }

    @Override
    public List<DataPackageDTO> getListPrimary(Long id) {
        List<DataPackage> list = dataPackageRepository.findDataPackagesByTypePackage(id);
        return dataPackageMapper.toDto(list);
    }

    // Format Price
    public static Double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

    // Merge LevelSchool For Create
    private void mergeLevelSchool(DataPackageDTO dataPackageDTO){
        if(dataPackageDTO.getListLevelSchool().size() > 1){
            List<String> listLevelSchool = dataPackageDTO.getListLevelSchool();
            StringBuilder stringLevel = new StringBuilder();
            if(listLevelSchool != null){
                // Merge
                for(String level:listLevelSchool){
                    stringLevel.append(level).append(",");
                }
            }
            String result = null;
            if(stringLevel.length() > 0 && stringLevel.charAt(stringLevel.length() - 1) == ','){
                result = stringLevel.substring(0,stringLevel.length()-1);
            }
             dataPackageDTO.setLevelSchool(result);
        }else{
            dataPackageDTO.setLevelSchool(dataPackageDTO.getListLevelSchool().get(0));
        }
    }

    private void mergeService(DataPackageDTO dataPackageDTO){
        if(dataPackageDTO.getListService().size() > 1){
            List<String> listService = dataPackageDTO.getListService();
            StringBuilder stringService = new StringBuilder();
            if(listService != null){
                // Merge
                for(String level:listService){
                    stringService.append(level).append(",");
                }
            }
            String result = null;
            if(stringService.length() > 0 && stringService.charAt(stringService.length() - 1) == ','){
                result = stringService.substring(0,stringService.length()-1);
            }
            dataPackageDTO.setService(result);
        }else if(dataPackageDTO.getListService().size() == 1){
            dataPackageDTO.setService(dataPackageDTO.getListService().get(0));
        }else {
            dataPackageDTO.setService(null);
        }
    }

    //Split and Merge LevelSchoolName
    private void splitLevelSchoolInDBAndCombineName(DataPackageDTO dataPackageDTO){
            String dataString = dataPackageDTO.getLevelSchool();
        if (dataString.length() > 0 && dataString.charAt(dataString.length() - 1) == ',') {
            dataString = dataString.substring(0, dataString.length() - 1);
        }
        String[] listLevelSchool = dataString.split(",");

        StringBuilder value = new StringBuilder();
        for(int i = 0; i < listLevelSchool.length ; i++){
            DataPackageDTO returnValue = dataPackageCustomRepository.findByLevelSchool(dataPackageDTO,listLevelSchool[i]);
            String levelSchoolName =  returnValue.getLevelSchoolName();
            value.append(levelSchoolName);
            value.append(", ");
        }
        // Add levelSchool in An ArrayList
        dataPackageDTO.setListLevelSchool(Arrays.asList(listLevelSchool));
        String returnValue = null;

        if(value.length() > 0 && value.charAt(value.length() - 2) == ','){
            returnValue = value.substring(0,value.length()-2);

        }
        dataPackageDTO.setLevelSchoolName(returnValue);
    }

    private void splitServiceInDBAndCombineName(DataPackageDTO dataPackageDTO){
        String dataString = dataPackageDTO.getService();
        if (dataString.length() > 0 && dataString.charAt(dataString.length() - 1) == ',') {
            dataString = dataString.substring(0, dataString.length() - 1);
        }
        String[] listService = dataString.split(",");

        StringBuilder value = new StringBuilder();
        for(int i = 0; i < listService.length ; i++){
            DataPackageDTO returnValue = dataPackageCustomRepository.findByService(dataPackageDTO,listService[i]);
            String serviceName =  returnValue.getServiceName();
            value.append(serviceName);
            value.append(", ");
        }
        // Add levelSchool in An ArrayList
        //dataPackageDTO.setListLevelSchool(Arrays.asList(listService));
        String returnValue = null;

        if(value.length() > 0 && value.charAt(value.length() - 2) == ','){
            returnValue = value.substring(0,value.length()-2);

        }
        dataPackageDTO.setServiceName(returnValue);
    }
    private String getCurrentUserNameLogin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            return authentication.getName();
        }
        return null;
    }

    public boolean isCheckAssignedForUpdatePrimaryPackage(DataPackageDTO dataPackageDTO){
        return  dataPackageCustomRepository.checkAlreadyAssignForSchool(dataPackageDTO);
    }

    @Override
    public List<ReportDataPackagesTreeDTO> reportDataPackage() {
//        ServiceResult serviceResult = new ServiceResult();
//        List<ReportDataPackagesDTO> listObject = new ArrayList<>();
//        HashMap<String, Long> total = new HashMap<>();
//        try {
//            listObject = dataPackageRepository.reportDataPackage().stream().map(e->{
//                ReportDataPackagesDTO dto = new ReportDataPackagesDTO();
//                dto.setCode(DataUtil.safeToString(e[0]));
//                dto.setSchoolCode(DataUtil.safeToString(e[1]));
//                dto.setSchoolName(DataUtil.safeToString(e[2]));
//                dto.setProvinceName(DataUtil.safeToString(e[3]));
//                dto.setLevelSchool(DataUtil.safeToString(e[4]));
////                dto.setTotalUser(DataUtil.safeToString(e[5]));
//                return dto;
//            }).collect(Collectors.toList());
//            List<ReportDataPackagesDTO> reportDataPackagesDTOS = new ArrayList<>();
//            List<ReportDataPackagesTreeDTO> listTree = new ArrayList<>();
//            for (int i = 0; i < listObject.size(); i++){
//                reportDataPackagesDTOS.add(listObject.get(i));
//                ReportDataPackagesTreeDTO reportDataPackagesTreeDTO = new ReportDataPackagesTreeDTO();
//                reportDataPackagesTreeDTO.setCode(listObject.get(i).getCode());
//                reportDataPackagesTreeDTO.setSchoolCode(listObject.get(i).getSchoolCode());
//                reportDataPackagesTreeDTO.setSchoolName(listObject.get(i).getSchoolName());
//                reportDataPackagesTreeDTO.setLevelSchool(listObject.get(i).getLevelSchool());
//                reportDataPackagesTreeDTO.setTotalUser(listObject.get(i).getTotalUser());
//                reportDataPackagesTreeDTO.setCode(listObject.get(i).getCode());
//                reportDataPackagesTreeDTO.setChirdlen(reportDataPackagesDTOS);
//                listTree.add(reportDataPackagesTreeDTO);
//            }
//            return listTree;
//        }catch (Exception ex){
//            this.log.error(ex.getMessage(), ex);
//            serviceResult.setMessage(Translator.toLocale("message.failed"));
//        }
        return null;
    }

    @Override
    public ServiceResult<List<Boolean>> checkUpdate(DataPackageDTO dataPackageDTO) {
        boolean isCheckDepended;
        boolean isCheckAssigned;
        boolean isSupportPackage;
        ServiceResult<List<Boolean>> res = new ServiceResult<>();
        List<Boolean> result = new ArrayList<>();

        // TH1:Check Là gói chính : Đã được nhà trường đăng kí HOẶC có gói phụ thuộc
        if (dataPackageDTO.getTypePackage() == 1) {
            isCheckAssigned = !dataPackageCustomRepository.checkAlreadyAssignForSchool(dataPackageDTO); // Check đã được nhà trường đăng kí
            isCheckDepended = !dataPackageCustomRepository.checkDependency(dataPackageDTO);// Check gói chính có gói phụ thuộc hay không.
            result.add(isCheckDepended);
            result.add(isCheckAssigned);

        } else if (dataPackageDTO.getTypePackage() == 0) {
            // TH2:Check Là gói phụ: Check gói phụ có gói chính được nhà trường đăng kí ==> Nếu là gói phụ, check xem gói chính của nó đã được nhà trường đăng kí chưa.
            isSupportPackage = !dataPackageCustomRepository.checkSupportPackageHavePrimaryPackageAssignedBySchool(dataPackageDTO);
            result.add(isSupportPackage);
        }
        result.add(false);
        res.setData(result);
        return res;
    }
    public List<DataPackageDTO> getAllByLevelSchool(String levelSchool) {
        return dataPackageCustomRepository.getAllByLevelSchool(levelSchool);
    }

    @Override
    public List<ReportDataPackagesTreeDTO> report(PackageStatisticsDTO packageStatisticsDTO) {
        LocalDate now = LocalDate.now();

        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");

        boolean checkNow = false;
        if(packageStatisticsDTO.getYear()==now.getYear()){
            checkNow = true;
        }

        int month = now.getMonth().getValue();

        if(packageStatisticsDTO.getQuarters()!=0){
            switch (packageStatisticsDTO.getQuarters()){
                case 1:
//                    if(checkNow==true){
//                        if(month==1 || month ==2 || month==3){
//                            checkNow = true;
//                        }
//                        else {
//                            checkNow = false;
//                        }
//                        if(checkNow == true)
//                        {
//                            packageStatisticsDTO.setDate(now.toString());
//                        }
//                        else {
//                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-03-31");
//                        }
//                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-03-31");
//                    }
                    break;
                case 2:
//                    if(checkNow==true){
//                        if(month==4 || month ==5 || month==6){
//                            checkNow = true;
//                        }
//                        else {
//                            checkNow = false;
//                        }
//                        if(checkNow == true)
//                        {
//                            packageStatisticsDTO.setDate(now.toString());
//                        }
//                        else {
//                            if(this.checkLeapYear(now.getYear())){
//                                packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-06-30");
//                            }
//
//                        }
//                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-06-30");
//                    }
                    break;
                case 3:
//                    if(checkNow==true){
//                        if(month==7 || month ==8 || month==9){
//                            checkNow = true;
//                        }
//                        else {
//                            checkNow = false;
//                        }
//                        if(checkNow == true)
//                        {
//                            packageStatisticsDTO.setDate(now.toString());
//                        }
//                        else {
//                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-09-30");
//                        }
//                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-09-30");
//                    }
                    break;
                case 4:
//                    if(checkNow==true){
//                        if(month==10 || month ==11 || month==12){
//                            checkNow = true;
//                        }
//                        else {
//                            checkNow = false;
//                        }
//                        if(checkNow == true)
//                        {
//                            packageStatisticsDTO.setDate(now.toString());
//                        }
//                        else {
//                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");
//                        }
//                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");
//                    }
                    break;
            }
        }


        if(packageStatisticsDTO.getMonth()!=0){
            switch (packageStatisticsDTO.getMonth()){
                case 1:
                    if(checkNow==true){
                        if(month==1){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-01-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-01-31");
                    }
                    break;
                case 2:
                    if(checkNow==true){
                        if(month==2){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            if(this.checkLeapYear(packageStatisticsDTO.getYear())){
                                packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-29");
                            }
                            else {
                                packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-28");
                            }
                        }
                    }else {
                        if(this.checkLeapYear(packageStatisticsDTO.getYear())){
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-29");
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-28");
                        };
                    }
                    break;
                case 3:
                    if(checkNow==true){
                        if(month==3){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-03-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-03-31");
                    }
                    break;
                case 4:
                    if(checkNow==true){
                        if(month==4){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-04-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-04-30");
                    }
                    break;
                case 5:
                    if(checkNow==true){
                        if(month==5){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-05-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-05-31");
                    }
                    break;
                case 6:
                    if(checkNow==true){
                        if(month==6){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-06-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-06-30");
                    }
                    break;
                case 7:
                    if(checkNow==true){
                        if(month==7){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-07-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-07-31");
                    }
                    break;
                case 8:
                    if(checkNow==true){
                        if(month==8){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-08-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-08-31");
                    }
                    break;
                case 9:
                    if(checkNow==true){
                        if(month==9){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-09-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-09-30");
                    }
                    break;
                case 10:
                    if(checkNow==true){
                        if(month==10){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-10-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-10-31");
                    }
                    break;
                case 11:
                    if(checkNow==true){
                        if(month==11){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-11-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-11-30");
                    }
                    break;
                case 12:
                    if(checkNow==true){
                        if(month==12){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");
                    }
                    break;
            }
        }
        Locale locale = LocaleContextHolder.getLocale();

        List<PackageStatisticsResultDTO> listSearch = packageStatisticsCustomerRepository.searchPackageStatistics(packageStatisticsDTO,locale.getLanguage());

        List<ReportDataPackagesDTO> reportDataPackagesDTOS = new ArrayList<>();
        List<ReportDataPackagesTreeDTO> tree = new ArrayList<>();

        for (int i = 0; i < listSearch.size(); i ++){
            if(listSearch.size() > 1){
                int check = 0;
                if(i == listSearch.size() - 1){
                    if(listSearch.get(i).getDataPackageCode().equals(listSearch.get(i-1).getDataPackageCode())){
                        ReportDataPackagesDTO report = new ReportDataPackagesDTO();
                        report.setCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolName(listSearch.get(i).getSchoolName());
                        report.setLevelSchool(listSearch.get(i).getLevelSchoolName());
                        report.setProvinceName(listSearch.get(i).getProvinceName());
                        report.setTotal(listSearch.get(i).getCountRegister1PackageOf1School());
                        report.setPackageCode(listSearch.get(i).getDataPackageCode());
                        if(report.getTotal() != 0)
                            reportDataPackagesDTOS.add(report);
                        check = 1;
                    }
                    else{
                        ReportDataPackagesDTO report = new ReportDataPackagesDTO();
                        report.setCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolName(listSearch.get(i).getSchoolName());
                        report.setLevelSchool(listSearch.get(i).getLevelSchoolName());
                        report.setProvinceName(listSearch.get(i).getProvinceName());
                        report.setTotal(listSearch.get(i).getCountRegister1PackageOf1School());
                        report.setPackageCode(listSearch.get(i).getDataPackageCode());
                        if(report.getTotal() != 0)
                            reportDataPackagesDTOS.add(report);
                        check = 1;
                    }
                }else{
                    if(listSearch.get(i).getDataPackageCode().equals(listSearch.get(i+1).getDataPackageCode())){
                        ReportDataPackagesDTO report = new ReportDataPackagesDTO();
                        report.setCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolName(listSearch.get(i).getSchoolName());
                        report.setLevelSchool(listSearch.get(i).getLevelSchoolName());
                        report.setProvinceName(listSearch.get(i).getProvinceName());
                        report.setTotal(listSearch.get(i).getCountRegister1PackageOf1School());
                        report.setPackageCode(listSearch.get(i).getDataPackageCode());
                        if(report.getTotal() != 0)
                            reportDataPackagesDTOS.add(report);
                    }else{
                        ReportDataPackagesDTO report = new ReportDataPackagesDTO();
                        report.setCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolCode(listSearch.get(i).getSchoolCode());
                        report.setSchoolName(listSearch.get(i).getSchoolName());
                        report.setLevelSchool(listSearch.get(i).getLevelSchoolName());
                        report.setProvinceName(listSearch.get(i).getProvinceName());
                        report.setTotal(listSearch.get(i).getCountRegister1PackageOf1School());
                        report.setPackageCode(listSearch.get(i).getDataPackageCode());
                        if(report.getTotal() != 0)
                            reportDataPackagesDTOS.add(report);
                        check = 1;
                    }
                }

                //
                if(check == 1){
                    ReportDataPackagesTreeDTO dataPackagesTreeDTO = new ReportDataPackagesTreeDTO();
                    dataPackagesTreeDTO.setCode(listSearch.get(i).getDataPackageCode());
                    dataPackagesTreeDTO.setPackageName(listSearch.get(i).getDataPackageName());
                    dataPackagesTreeDTO.setTotal(listSearch.get(i).getTotalRegistration());
                    List<ReportDataPackagesDTO> reportDataPackagesDTOSort = new ArrayList<>();
                    if(reportDataPackagesDTOS.size() > 0)
                        reportDataPackagesDTOSort = reportDataPackagesDTOS.stream().sorted(Comparator.comparingLong(ReportDataPackagesDTO::getTotal).reversed()).collect(Collectors.toList());
                    if(dataPackagesTreeDTO.getTotal() != 0)
                        dataPackagesTreeDTO.setChirdlen(reportDataPackagesDTOSort);
                    if(packageStatisticsDTO.getSchoolSearch() != "" && dataPackagesTreeDTO.getTotal() != 0)
                        tree.add(dataPackagesTreeDTO);
                    if(packageStatisticsDTO.getSchoolSearch() == "")
                        tree.add(dataPackagesTreeDTO);
                    reportDataPackagesDTOS = new ArrayList<>();
                }
            }
            else{
                ReportDataPackagesTreeDTO dataPackagesTreeDTO = new ReportDataPackagesTreeDTO();
                dataPackagesTreeDTO.setCode(listSearch.get(i).getDataPackageCode());
                dataPackagesTreeDTO.setPackageName(listSearch.get(i).getDataPackageName());
                dataPackagesTreeDTO.setTotal(listSearch.get(i).getTotalRegistration());
                // Set chird
                ReportDataPackagesDTO report = new ReportDataPackagesDTO();
                report.setCode(listSearch.get(i).getSchoolCode());
                report.setSchoolCode(listSearch.get(i).getSchoolCode());
                report.setSchoolName(listSearch.get(i).getSchoolName());
                report.setLevelSchool(listSearch.get(i).getLevelSchoolName());
                report.setProvinceName(listSearch.get(i).getProvinceName());
                report.setTotal(listSearch.get(i).getCountRegister1PackageOf1School());
                report.setPackageCode(listSearch.get(i).getDataPackageCode());
                if(report.getTotal() != 0)
                    reportDataPackagesDTOS.add(report);
                List<ReportDataPackagesDTO> reportDataPackagesDTOSort = new ArrayList<>();
                if(reportDataPackagesDTOS.size() > 0)
                    reportDataPackagesDTOSort = reportDataPackagesDTOS.stream().sorted(Comparator.comparingLong(ReportDataPackagesDTO::getTotal).reversed()).collect(Collectors.toList());
                if(dataPackagesTreeDTO.getTotal() != 0)
                    dataPackagesTreeDTO.setChirdlen(reportDataPackagesDTOSort);
                if(packageStatisticsDTO.getSchoolSearch() != ""  && dataPackagesTreeDTO.getTotal() != 0) {
                    tree.add(dataPackagesTreeDTO);
                }if(packageStatisticsDTO.getSchoolSearch() == ""){
                    tree.add(dataPackagesTreeDTO);
                }
            }

        }

        List<ReportDataPackagesTreeDTO> treeSort = tree.stream().sorted(Comparator.comparingLong(ReportDataPackagesTreeDTO::getTotal).reversed()).collect(Collectors.toList());
        if(packageStatisticsDTO.getSchoolSearch() != null || packageStatisticsDTO.getPackageSearch() != null){

        }
        return treeSort;
    }


    @Override
    public ServiceResult<?> getListDataPackageByCode(@RequestBody RegisterPackageDTO registerPackageDTO){
        List<String> listDataPackageName = new ArrayList<>();
        for (String item:registerPackageDTO.getDataPackageCode() ) {
            Optional<DataPackage> dataPackage = dataPackageRepository.findDataPackageByCode(item);
            if(dataPackage.isPresent()){
                listDataPackageName.add(dataPackage.get().getName());
            }
            else {
                return new ServiceResult<>(null, HttpStatus.BAD_REQUEST, Translator.toLocale("failed"));
            }
        }

        return new ServiceResult<>(listDataPackageName, HttpStatus.OK, Translator.toLocale("success"));
    }

    @Override
    public ServiceResult<?> checkExistDataPackage(String code) {
        Optional<DataPackage> exist = dataPackageRepository.findByCode(code);
        if(exist.isPresent()){
            return new ServiceResult<>(exist.get(),HttpStatus.BAD_REQUEST, Translator.toLocale("data_package.create.exist_code"));
        }else{
            return  new ServiceResult<>(null, HttpStatus.OK,null);
        }
    }


//    private ServiceResult<DataPackageDTO> checkSaveOrUpdateWhenTypePackageIsSupportPackage(DataPackageDTO dataPackageDTO){
//        if(dataPackageDTO.getTypePackage() == 0){
//            List<DataPackageDTO> existSupportPackageHavePrimaryPackage= dataPackageCustomRepository.findPrimaryPackageBySupportPackage(dataPackageDTO);
//            if(existSupportPackageHavePrimaryPackage.size() > 0){
//                for(DataPackageDTO dataCheck : existSupportPackageHavePrimaryPackage){
////                    if(dataPackageDTO.getSemesterApply().equals(dataCheck.getSemesterApply())
////                        && dataPackageDTO.getQuantitySemesterApply().equals(dataCheck.getQuantitySemesterApply())){
////                        rs.setMessage(Translator.toLocale("data_package.duplicate_semesterApply_and_quantitySemesterApply"));
////                        rs.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
////                        return rs;
////                    }
//                    if(dataPackageDTO.getSemesterApply().equals(dataCheck.getSemesterApply())){
//                        rs.setMessage(Translator.toLocale("data_package.duplicate_semesterApply"));
//                        rs.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
//                        return rs;
//                    }
//                }
//            }
//        }
//        return null;
//    }

    public boolean checkLeapYear(int year){
        boolean isLeap = false;
        if(year % 4 == 0)
        {
            if( year % 100 == 0)
            {
                if ( year % 400 == 0)
                    isLeap = true;
                else
                    isLeap = false;
            }
            else
                isLeap = true;
        }
        else {
            isLeap = false;
        }
        return isLeap;
    }

    @Override
    public ServiceResult<?> searchPackageStatistics(@RequestBody PackageStatisticsDTO packageStatisticsDTO){

        LocalDate now = LocalDate.now();

        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");

        boolean checkNow = false;
        if(packageStatisticsDTO.getYear()==now.getYear()){
            checkNow = true;
        }

        int month = now.getMonth().getValue();

        if(packageStatisticsDTO.getQuarters()!=0){
            switch (packageStatisticsDTO.getQuarters()){
                case 1:
                    packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-03-31");
                    break;
                case 2:
                    packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-06-30");
                    break;
                case 3:
                    packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-09-30");
                    break;
                case 4:
                    packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");
                    break;
            }
        }


        if(packageStatisticsDTO.getMonth()!=0){
            switch (packageStatisticsDTO.getMonth()){
                case 1:
                    if(checkNow==true){
                        if(month==1){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-01-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-01-31");
                    }
                    break;
                case 2:
                    if(checkNow==true){
                        if(month==2){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            if(this.checkLeapYear(packageStatisticsDTO.getYear())){
                                packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-29");
                            }
                            else {
                                packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-28");
                            }
                        }
                    }else {
                        if(this.checkLeapYear(packageStatisticsDTO.getYear())){
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-29");
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-02-28");
                        };
                    }
                    break;
                case 3:
                    if(checkNow==true){
                        if(month==3){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-03-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-03-31");
                    }
                    break;
                case 4:
                    if(checkNow==true){
                        if(month==4){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-04-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-04-30");
                    }
                    break;
                case 5:
                    if(checkNow==true){
                        if(month==5){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-05-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-05-31");
                    }
                    break;
                case 6:
                    if(checkNow==true){
                        if(month==6){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-06-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-06-30");
                    }
                    break;
                case 7:
                    if(checkNow==true){
                        if(month==7){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-07-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-07-31");
                    }
                    break;
                case 8:
                    if(checkNow==true){
                        if(month==8){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-08-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-08-31");
                    }
                    break;
                case 9:
                    if(checkNow==true){
                        if(month==9){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-09-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-09-30");
                    }
                    break;
                case 10:
                    if(checkNow==true){
                        if(month==10){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-10-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-10-31");
                    }
                    break;
                case 11:
                    if(checkNow==true){
                        if(month==11){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-11-30");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-11-30");
                    }
                    break;
                case 12:
                    if(checkNow==true){
                        if(month==12){
                            checkNow = true;
                        }
                        else {
                            checkNow = false;
                        }
                        if(checkNow == true)
                        {
                            packageStatisticsDTO.setDate(now.toString());
                        }
                        else {
                            packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");
                        }
                    }else {
                        packageStatisticsDTO.setDate(String.valueOf(packageStatisticsDTO.getYear())+"-12-31");
                    }
                    break;
            }
        }


        Locale locale = LocaleContextHolder.getLocale();

        List<PackageStatisticsResultDTO> listSearch = packageStatisticsCustomerRepository.searchPackageStatistics(packageStatisticsDTO,locale.getLanguage());

        List<PackageStatisticsReturnDTO> result = new ArrayList<>();

        PackageStatisticsReturnDTO packageStatisticsReturnDTO = new PackageStatisticsReturnDTO();

        String a = null;

        if(listSearch.size()==0){
            return new ServiceResult<>(null, HttpStatus.OK, Translator.toLocale("_not_found"));
        }


        a= listSearch.get(0).getDataPackageCode();
        packageStatisticsReturnDTO.setDataPackageName(listSearch.get(0).getDataPackageName());
        packageStatisticsReturnDTO.setDataPackageCode(listSearch.get(0).getDataPackageCode());
        packageStatisticsReturnDTO.setTotalRegisted(listSearch.get(0).getTotalRegistration());

        List<PackageStatisticsResultDTO> listPackageStatisticsResultDTO = new ArrayList<>();

        for(int i=0; i< listSearch.size(); i++){
            if(listSearch.get(i).getDataPackageCode().equals(a)){
                if(!listSearch.get(i).getCountRegister1PackageOf1School().equals(0L)){
                    listPackageStatisticsResultDTO.add(listSearch.get(i));
                }
            }
            else {

                String name = listSearch.get(i-1).getDataPackageCode();
                String code = listSearch.get(i-1).getDataPackageCode();
                Long total = listSearch.get(i-1).getTotalRegistration();
                List<PackageStatisticsResultDTO> listAdd = new ArrayList<>(listPackageStatisticsResultDTO);
//                List<PackageStatisticsResultDTO> listAdd = listPackageStatisticsResultDTO;
                PackageStatisticsReturnDTO add = new PackageStatisticsReturnDTO();
                add.setDataPackageName(name);
                add.setDataPackageCode(code);
                add.setTotalRegisted(total);
                listAdd =  listAdd.stream()
                    .sorted(Comparator.comparingLong(PackageStatisticsResultDTO::getCountRegister1PackageOf1School).reversed())
                    .collect(Collectors.toList());
                add.setChildren(listAdd);
                result.add(add);

                listPackageStatisticsResultDTO.clear();

                a=listSearch.get(i).getDataPackageCode();
                packageStatisticsReturnDTO.setDataPackageName(listSearch.get(i).getDataPackageName());
                packageStatisticsReturnDTO.setDataPackageCode(listSearch.get(i).getDataPackageCode());
                packageStatisticsReturnDTO.setTotalRegisted(listSearch.get(i).getTotalRegistration());
                if(!listSearch.get(i).getCountRegister1PackageOf1School().equals(0L)){
                    listPackageStatisticsResultDTO.add(listSearch.get(i));
                }
            }
        }

        packageStatisticsReturnDTO.setChildren(listPackageStatisticsResultDTO);
        result.add(packageStatisticsReturnDTO);

        result =  result.stream()
            .sorted(Comparator.comparingLong(PackageStatisticsReturnDTO::getTotalRegisted).reversed())
            .collect(Collectors.toList());

//        for(int i=0; i< result.size(); i++){
//            for(int j=i+1; j<result.size(); j++){
//                if(result.get(j).getTotalRegisted()>result.get(i).getTotalRegisted()){
//                    PackageStatisticsReturnDTO swap = result.get(i);
//                    result.set(i,result.get(j));
//                    result.set(j,swap);
//                }
//            }
//        }

        return new ServiceResult<>(result, HttpStatus.OK, Translator.toLocale("success"));
    }

    public ServiceResult<?> monthlyPackageStatistics(@RequestBody PackageStatisticsDTO packageStatisticsDTO){
        List<PackageStatisticsByMonthDTO> data = packageStatisticsCustomerRepository.monthlyStatistics(packageStatisticsDTO);
        if(data.size()==0){
            return new ServiceResult<>(null, HttpStatus.BAD_REQUEST, Translator.toLocale("failed"));
        }
        return new ServiceResult<>(data, HttpStatus.OK, Translator.toLocale("success"));
    }

    @Override
    public List<DataPackage> findDataPackageByCodeOrNameLimit50(String codeOrName) {
        return dataPackageRepository.searchNameOrCodeLimit50(codeOrName);
    }

    @Override
    public List<AppParamDTO> findByPrimaryPackageCode(String primaryPackageCode) {
        DataPackage dataPackage = dataPackageRepository.findByCode(primaryPackageCode).orElseGet(DataPackage::new);
        List<String> appParamCodes = Arrays.asList(dataPackage.getService().split(","));
        final String dataPackageServiceAppParamType = "data_packages_service";
        List<AppParam> appParams = appParamRepository.findByCodeInAndType(appParamCodes, dataPackageServiceAppParamType);
        String lang = LocaleContextHolder.getLocale().getLanguage();
        List<AppParamDTO> appParamDTOS = appParamMapper.toDto(appParams);
        for (AppParamDTO dto : appParamDTOS) {
            if ("la".equals(lang)) {
                dto.setName(dto.getNameLA());
            } else if ("en".equals(lang)) {
                dto.setName(dto.getNameEN());
            }
        }
        return appParamDTOS;
    }

    @Override
    public DataPackage findByCode(String code) {
        return dataPackageRepository.findByCode(code).orElseGet(DataPackage::new);
    }

}
