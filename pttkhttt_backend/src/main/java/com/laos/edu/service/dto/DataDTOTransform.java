package com.laos.edu.service.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class DataDTOTransform implements Serializable {
    private String studentCode;
    private String studentName;
    private int totalCount;
    private int totalRestByReason;
    private int totalRestNoReason;
    private int totalGoingSchool;
}
