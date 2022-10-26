package com.laos.edu.service.dto;

import com.laos.edu.domain.ReportSendMessage;
import lombok.Data;

import java.util.List;

@Data
public class ReportSendMessageDTO {
    private String schoolCode;

    private String packageCode;

    private String year;

    private Double numberSendSms;

    private Integer month;

    private List<ReportSendMessage> reportSendMessageList;
}
