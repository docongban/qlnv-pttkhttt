package com.laos.edu.service.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class DataDTO extends ExportDTO implements Serializable {
    private String studentCode;
    private String studentName;
    private String parentCode;

    private String currentYear;
    private String currentClassCode;
    private Map<String, String> dayAndCheckDateOfMonth;
    private int totalCount;
    private int totalRestByReason;
    private int totalRestNoReason;
    private int totalGoingSchool;
    private List<String> studentCodes;
    // data grid server client need save
    private String month;
    private String years;
    private String semester;
    private List<DataDTOTransform> lstData;
    //
    private int currentPage;
    private int pageSize;
    private long totalRecord;

}
