package com.laos.edu.service.impl;

import com.laos.edu.commons.Translator;
import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.domain.ReportSendMessage;
import com.laos.edu.repository.ReportSendMessageRepository;
import com.laos.edu.service.ReportSendMessageService;
import com.laos.edu.service.dto.RegisterPackageDTO;
import com.laos.edu.service.dto.ServiceResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReportSendMessageServiceImpl implements ReportSendMessageService {

    private final Logger log = LoggerFactory.getLogger(RegisterPackageServiceImpl.class);

    @Autowired
    private ReportSendMessageRepository reportSendMessageRepository;

    @Override
    public ServiceResult<?> save(List<ReportSendMessage> reportSendMessageList){
        log.debug("Request to save RegisterPackage : {}", reportSendMessageList);
        try{
            List<ReportSendMessage> registerPackageList = reportSendMessageRepository.saveAll(reportSendMessageList);
            return new ServiceResult<>(registerPackageList, HttpStatus.OK, Translator.toLocale("_success"));
        }catch (Exception ex){
            return new ServiceResult<>(null, HttpStatus.BAD_REQUEST, Translator.toLocale("_failed"));
        }


    }
}
