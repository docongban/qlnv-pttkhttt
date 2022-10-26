package com.laos.edu.service.impl;

import com.laos.edu.commons.Translator;
import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.domain.RegisterPackageDetails;
import com.laos.edu.repository.*;
import com.laos.edu.service.RegisterPackageService;
import com.laos.edu.service.UserService;
import com.laos.edu.service.dto.*;
import com.laos.edu.service.mapper.RegisterPackageDetailsMapper;
import com.laos.edu.service.mapper.RegisterPackageMapper;
import com.laos.edu.soapws.SmsHandler;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link RegisterPackage}.
 */
@Service
@Transactional
public class RegisterPackageServiceImpl implements RegisterPackageService {

    private final Logger log = LoggerFactory.getLogger(RegisterPackageServiceImpl.class);

    private final RegisterPackageRepository registerPackageRepository;

    private final RegisterPackageMapper registerPackageMapper;

    private final RegisterPackageDetailsMapper registerPackageDetailsMapper;


    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DataPackageRepository dataPackageRepository;

    @Autowired
    private RegisterPackageDetailsRepository registerPackageDetailsRepository;

    @Autowired
    private ManagementRegistrationCustomerRepository managementRegistrationCustomerRepository;

    @Autowired
    private SmsHandler smsHandler;
    public RegisterPackageServiceImpl(RegisterPackageRepository registerPackageRepository, RegisterPackageMapper registerPackageMapper, RegisterPackageDetailsMapper registerPackageDetailsMapper) {
        this.registerPackageRepository = registerPackageRepository;
        this.registerPackageMapper = registerPackageMapper;
        this.registerPackageDetailsMapper = registerPackageDetailsMapper;
    }

    @Override
    public RegisterPackageDTO save(RegisterPackageDTO registerPackageDTO) {
        log.debug("Request to save RegisterPackage : {}", registerPackageDTO);
        RegisterPackage registerPackage = registerPackageMapper.toEntity(registerPackageDTO);
        registerPackage = registerPackageRepository.save(registerPackage);
        return registerPackageMapper.toDto(registerPackage);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RegisterPackageDTO> findAll(Pageable pageable) {
        log.debug("Request to get all RegisterPackages");
        return registerPackageRepository.findAll(pageable).map(registerPackageMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RegisterPackageDTO> findOne(Long id) {
        log.debug("Request to get RegisterPackage : {}", id);
        return registerPackageRepository.findById(id).map(registerPackageMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete RegisterPackage : {}", id);
        registerPackageRepository.deleteById(id);
    }

    @Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = {Exception.class, Throwable.class})
    public ServiceResult<List<RegisterPackageDTO>> saveRegisterPackage(@RequestBody RegisterDTO registerDTO) {
        log.debug("Request to save RegisterPackage : {}", registerDTO);

        try {
            if(registerDTO.getRegisterPackageDetailsDTOList().get(0).getSemester().equals(5L)){
                List<RegisterPackageDetails> listRegisterPackageDetails = new ArrayList<>();
                for(String item: registerDTO.getStudentCodeList()){
                    List<RegisterPackageDetails> listRegisterPackageDetails1 = registerPackageDetailsRepository.findByStudentCodeAndShoolYearWithCondition(item,registerDTO.getSchoolYear());

                    for (RegisterPackageDetails item1 : listRegisterPackageDetails1) {
                        if (item1 != null) {

                            RegisterPackageDetails registerPackageDetails= new RegisterPackageDetails();

                            for(int i=0; i<registerDTO.getAutoCancelRegisterPackageDetailsDTOList().size(); i++){
                                if(registerDTO.getAutoCancelRegisterPackageDetailsDTOList().get(i).getIdPass().equals(item1.getRegisPackIdSchool())){
                                    registerPackageDetails.setRegisPackIdSchool(registerDTO.getAutoCancelRegisterPackageDetailsDTOList().get(i).getId());
                                    break;
                                }
                            }

                            registerPackageDetails.setAction(2L);
                            registerPackageDetails.setStatus(3L);
                            registerPackageDetails.setCreateDate(Instant.now());
                            registerPackageDetails.setCreator("1");

                            registerPackageDetails.setDataPackage(item1.getDataPackage());
                            registerPackageDetails.setActiveDate(item1.getActiveDate());
                            registerPackageDetails.setStartDate(item1.getStartDate());
                            registerPackageDetails.setEndDate(item1.getEndDate());
                            registerPackageDetails.setRegisterPackageCode(item1.getRegisterPackageCode());

                            listRegisterPackageDetails.add(registerPackageDetails);
                        }
                    }
                }
                registerPackageDetailsRepository.saveAll(listRegisterPackageDetails);
            }
              List<RegisterPackage> a = registerDTO.getRegisterPackageDTOList()
                .stream()
                .map(registerPackageMapper::toEntity)
                .collect(Collectors.toList());

            registerPackageRepository.saveAll(registerDTO.getRegisterPackageDTOList()
                .stream()
                .map(registerPackageMapper::toEntity)
                .collect(Collectors.toList())
            );

            registerPackageDetailsRepository.saveAll(registerDTO.getRegisterPackageDetailsDTOList()
                .stream()
                .map(registerPackageDetailsMapper::toEntity)
                .collect(Collectors.toList())
            );

            ServiceResult<List<RegisterPackageDTO>> result = new ServiceResult<>();
            result.setStatus(HttpStatus.OK);
            result.setMessage(Translator.toLocale("register_success"));
            return result;
        } catch (Exception ex) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            ServiceResult<List<RegisterPackageDTO>> result = new ServiceResult<>();
            result.setStatus(HttpStatus.BAD_REQUEST);
            result.setMessage(Translator.toLocale("failed_process"));
            return result;
        }
    }

    @Override
    public ServiceResult<RegisterPackageDTO> cancelRegisterPackage(@RequestBody RegisterPackageDetailsDTO registerPackageDetailsDTO) {
        try {
            RegisterPackageDetails registerPackageDetails1 = registerPackageDetailsRepository.findByRegisPackIdSchool(registerPackageDetailsDTO.getRegisPackIdSchool());
            RegisterPackageDetails registerPackageDetails = new RegisterPackageDetails();

            registerPackageDetails.setStatus(3L);
            registerPackageDetails.setDataPackage(registerPackageDetails1.getDataPackage());
            registerPackageDetails.setCreateDate(Instant.now());
            registerPackageDetails.setCreator("1");
            registerPackageDetails.setAction(0L);
            registerPackageDetails.setActiveDate(registerPackageDetails1.getActiveDate());
            registerPackageDetails.setStartDate(registerPackageDetails1.getStartDate());
            registerPackageDetails.setEndDate(registerPackageDetails1.getEndDate());
            registerPackageDetails.setRegisPackIdSchool(registerPackageDetailsDTO.getId());
            registerPackageDetails.setRegisterPackageCode(registerPackageDetails1.getRegisterPackageCode());

            registerPackageDetailsRepository.save(registerPackageDetails);

            return new ServiceResult<>(null, HttpStatus.OK, Translator.toLocale("cancel_success"));
        } catch (Exception ex) {
            return new ServiceResult<>(new RegisterPackageDTO(), HttpStatus.BAD_REQUEST, Translator.toLocale("cancel_failed"));
        }
    }

    @Override
    public ServiceResult<List<RegisterPackageDetails>> findRegisterPackagesByStatusAndActiveDateExits(String schoolCode, List<String> lst) {
        List<RegisterPackageDetails> listResult = new ArrayList<>();
        try{
            listResult = registerPackageDetailsRepository.findRegisterPackagesByStatusAndActiveDateExists(2L,schoolCode, lst);
        }catch (Exception ex){
            return  new ServiceResult<>(listResult, HttpStatus.BAD_REQUEST,null);
        }
        return new ServiceResult<>(listResult,HttpStatus.OK,null);
    }

//    cancelRegisterPackageExpired

    @Override
    public ServiceResult<String> cancelRegisterPackageExpired(ServiceResult<List<RegisterPackageDetails>> result) {
        try{

//            List<RegisterPackageDetails> registerPackageDetailsList = registerPackageDetailsRepository.cancelRegisterPackageExpired();

            List<RegisterPackageDetails> registerPackageDetailsList = new ArrayList<>();

//            List<RegisterPackageDetails> registerPackageDetailsList1 = result.getData();

            List<RegisterPackageDetails> registerPackageDetailsSave = new ArrayList<>();
            for(RegisterPackageDetails item : result.getData()){
                if(item!=null){
                    RegisterPackageDetails registerPackageDetails = registerPackageDetailsRepository.cancelRegisterPackageExpired(item.getRegisterPackageCode());
                    registerPackageDetails.setStatus(3L);
                    registerPackageDetails.setDataPackage(registerPackageDetails.getDataPackage());
                    registerPackageDetails.setCreateDate(Instant.now());
                    registerPackageDetails.setCreator("1");
                    registerPackageDetails.setAction(2L);
                    registerPackageDetails.setActiveDate(registerPackageDetails.getActiveDate());
                    registerPackageDetails.setStartDate(registerPackageDetails.getStartDate());
                    registerPackageDetails.setEndDate(registerPackageDetails.getEndDate());
                    registerPackageDetails.setRegisPackIdSchool(item.getId());
                    registerPackageDetails.setRegisterPackageCode(registerPackageDetails.getRegisterPackageCode());
                    registerPackageDetailsSave.add(registerPackageDetails);
                }

//                registerPackageDetailsList.add(registerPackageDetails);

            }


//            for(RegisterPackageDetails item: registerPackageDetailsList){
//                RegisterPackageDetails registerPackageDetails = new RegisterPackageDetails();
//                registerPackageDetails.setStatus(3L);
//                registerPackageDetails.setDataPackage(item.getDataPackage());
//                registerPackageDetails.setCreate_date(Instant.now());
//                registerPackageDetails.setCreator("1");
//                registerPackageDetails.setAction(2L);
//                registerPackageDetails.setActiveDate(item.getActiveDate());
//                registerPackageDetails.setStartDate(item.getStartDate());
//                registerPackageDetails.setEndDate(item.getEndDate());
//                registerPackageDetails.setRegisPackIdSchool(item.getRegisPackIdSchool());
//                registerPackageDetails.setRegisterPackageCode(item.getRegisterPackageCode());
//                registerPackageDetailsSave.add(registerPackageDetails);
//            }

            if(registerPackageDetailsSave!= null){
                registerPackageDetailsRepository.saveAll(registerPackageDetailsSave);
            }
            return new ServiceResult<>("Success",HttpStatus.OK,null);
        }catch (Exception ex){
            return new ServiceResult<>("Failed",HttpStatus.BAD_REQUEST,null);
        }
    }

    @Override
    public ManagementRegistrationResultDTO searchManagementRegistration(ManagementRegistrationDTO managementRegistrationDTO){
        return managementRegistrationCustomerRepository.searchManagementRegistration(managementRegistrationDTO);
    }

    @Override
    public ServiceResult<RegisterHistoryDTO> getHistoryRegisterPackage(RegisterPackageDTO registerPackageDTO) {

        try{
            List<RegisterPackageDetails> listHistory1 = registerPackageDetailsRepository.findHistoryRegister(registerPackageDTO.getStudentCode(), registerPackageDTO.getShoolYear(),registerPackageDTO.getPage()-1,registerPackageDTO.getPageSize());

            List<RegisterPackageDetailsDTO> listHistory = registerPackageDetailsRepository.findHistoryRegister(registerPackageDTO.getStudentCode(), registerPackageDTO.getShoolYear(),registerPackageDTO.getPage()-1,registerPackageDTO.getPageSize())
                .stream()
                .map(registerPackageDetailsMapper::toDto)
                .collect(Collectors.toList());

            Long totalRecord = registerPackageDetailsRepository.totalRecordHistory(registerPackageDTO.getStudentCode(), registerPackageDTO.getShoolYear());

            for (RegisterPackageDetailsDTO item : listHistory) {
                item.setDataPackageName(dataPackageRepository.findByCode(item.getDataPackage()).get().getName());
            }

            RegisterHistoryDTO registerHistoryDTO = new RegisterHistoryDTO();

            registerHistoryDTO.setRegisterPackageDetailsDTOList(listHistory);
            registerHistoryDTO.setTotalRecord(totalRecord);

            return new ServiceResult<>(registerHistoryDTO,HttpStatus.OK,Translator.toLocale("success"));
        }
        catch (Exception ex){
            return new ServiceResult<>(null,HttpStatus.BAD_REQUEST,Translator.toLocale("failed"));
        }

    }

    @Override
    @Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = {Exception.class, Throwable.class})
    public ServiceResult<String> activeRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO){

        try {
            List<RegisterPackageDetails> result = managementRegistrationCustomerRepository.findToActive(registerPackageDTO.getListIdRegisterPackageDetail());

            for(RegisterPackageDetails item: result){
                if(item != null){
                    item.setStatus(2L);
                    item.setActiveDate(Instant.now());
                }
            }
            registerPackageDetailsRepository.saveAll(result);

//            String phone = "";
//            for(RegisterPackageDetails item1: result){
//                RegisterPackage registerPackage = registerPackageRepository.findByCode(item1.getRegisterPackageCode());
//                phone = phone + registerPackage.getPhone()+",";
//            }
//            phone = phone.substring(0, phone.length() - 1);

//            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
//
//            SmsDTO smsDTO = new SmsDTO();
//            for(RegisterPackageDetails item1: result){
//                RegisterPackage registerPackage = registerPackageRepository.findByCode(item1.getRegisterPackageCode());
//                String content = Translator.toLocale("_contentSMS_part1")
//                    +" "+item1.getDataPackage()+ " "+Translator.toLocale("_contentSMS_part2")
//                    + " "+formatter.format(Date.from(item1.getStartDate())) + " " + Translator.toLocale("_contentSMS_part3")
//                    + " "+ formatter.format(Date.from(item1.getEndDate()));
//                smsDTO.setPhoneNumber(registerPackage.getPhone());
//                smsDTO.setContent(content);
//                smsDTO.setLanguageId(1);
//                ImportSMSResponse imp = smsHandler.sendOtp(smsDTO);
//                if(imp.getErrorCode().equalsIgnoreCase("0"))
//                    new ServiceResult<>(Translator.toLocale("_Invalid_username_or_password"),HttpStatus.BAD_REQUEST,Translator.toLocale("_Invalid_username_or_password"));
////                    throw new Exception("Error");
//
//                if(imp.getErrorCode().equalsIgnoreCase("2"))
//                    new ServiceResult<>(Translator.toLocale("_Invalid_Brandname"),HttpStatus.BAD_REQUEST,Translator.toLocale("_Invalid_Brandname"));
//                if(imp.getErrorCode().equalsIgnoreCase("3"))
//                    new ServiceResult<>(Translator.toLocale("_Send_SMS_Failed"),HttpStatus.BAD_REQUEST,Translator.toLocale("_Send_SMS_Failed"));
//                if(imp.getErrorCode().equalsIgnoreCase("4"))
//                    new ServiceResult<>(Translator.toLocale("_Not_enough_money"),HttpStatus.BAD_REQUEST,Translator.toLocale("_Not_enough_money"));
//                if(imp.getErrorCode().equalsIgnoreCase("5"))
//                    new ServiceResult<>(Translator.toLocale("_Company_not_permission_send_SMS_via_API"),HttpStatus.BAD_REQUEST,Translator.toLocale("_Company_not_permission_send_SMS_via_API"));
//                if(imp.getErrorCode().equalsIgnoreCase("6"))
//                    new ServiceResult<>(Translator.toLocale("_Invalid_IP_Address"),HttpStatus.BAD_REQUEST,Translator.toLocale("_Invalid_IP_Address"));
//                if(imp.getErrorCode().equalsIgnoreCase("7"))
//                    new ServiceResult<>(Translator.toLocale("_Invalid_phone_number"),HttpStatus.BAD_REQUEST,Translator.toLocale("_Invalid_phone_number"));
//
//            }



            return new ServiceResult<>(Translator.toLocale("_actionSuccess"),HttpStatus.OK,Translator.toLocale("_actionSuccess"));
        }catch (Exception ex){
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            log.error("Error",ex);
            return new ServiceResult<>(null, HttpStatus.BAD_REQUEST,Translator.toLocale("_actionFailed"));
        }

    }

}
