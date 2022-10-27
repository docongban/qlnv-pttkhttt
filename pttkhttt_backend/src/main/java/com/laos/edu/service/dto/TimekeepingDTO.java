package com.laos.edu.service.dto;

import lombok.Data;

import javax.persistence.Column;
import java.time.Instant;

@Data
public class TimekeepingDTO {

    private Integer id;

    private String employeeCode;

    private String employeeName;

    private String employeeSex;

    private String employeePhoneNumber;

    private String employeeEmail;

    private String employeeAddress;

    private Instant timeAt;

    private Instant createdTime;

    private Instant updatedTime;

    private Instant fromDate;

    private Instant toDate;
}
