package com.laos.edu.service;

import com.laos.edu.domain.ReportSendMessage;
import com.laos.edu.service.dto.RegisterPackageDTO;
import com.laos.edu.service.dto.ServiceResult;

import java.util.List;

public interface ReportSendMessageService {
    ServiceResult<?> save(List<ReportSendMessage> reportSendMessageList);
}
