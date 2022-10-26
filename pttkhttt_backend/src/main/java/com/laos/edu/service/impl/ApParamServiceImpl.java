package com.laos.edu.service.impl;

import com.laos.edu.commons.Translator;
import com.laos.edu.domain.AppParam;
import com.laos.edu.repository.AppParamRepository;
import com.laos.edu.service.ApParamService;
import com.laos.edu.service.dto.ServiceResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ApParamServiceImpl implements ApParamService {

    private final Logger log = LoggerFactory.getLogger(ApParamServiceImpl.class);

    private final AppParamRepository appParamRepository;

    public ApParamServiceImpl(AppParamRepository appParamRepository) {
        this.appParamRepository = appParamRepository;
    }

    @Override
    public ServiceResult findByParentCode(String parentCode) {
        this.log.debug("request to find ap-param by parent-code");
        ServiceResult serviceResult = new ServiceResult();

        try {
            List<AppParam> appParams = this.appParamRepository.findByParentCode(parentCode);

            serviceResult.setData(appParams);
            serviceResult.setMessage(Translator.toLocale("message.success"));
            serviceResult.setStatus(HttpStatus.OK);
        } catch (Exception e) {
            this.log.error(e.getMessage(), e);
            serviceResult.setMessage(Translator.toLocale("message.failed"));
            serviceResult.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return serviceResult;
    }

    @Override
    public List<AppParam> findByType(String type) {
        List<AppParam> appParamsByType = this.appParamRepository.getAppParamsByTypeOrderByNameAsc(type);
        return appParamsByType;
    }

    @Override
    public List<AppParam> findAllByTypeDataPackageService(String type) {
        List<AppParam> dataPackages = this.appParamRepository.getAllByTypeDataPackageService(type);
        if(dataPackages.isEmpty()){
            return Collections.emptyList();
        }else {
            return dataPackages;
        }
    }
}
