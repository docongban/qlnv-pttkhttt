package com.laos.edu.service;

import com.laos.edu.domain.AppParam;
import com.laos.edu.service.dto.ServiceResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ApParamService {

    ServiceResult findByParentCode(String parentCode);

    List<AppParam> findByType(String type);

    List<AppParam> findAllByTypeDataPackageService(String type);
}
