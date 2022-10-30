package com.laos.edu.service.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class TimekeepingExportDTO {
    private String employeeCode;

    private String employeeName;

    private String employeeSex;

    private String employeePhoneNumber;

    private String employeeEmail;

    private String employeeAddress;

    private String timeAt;
}
