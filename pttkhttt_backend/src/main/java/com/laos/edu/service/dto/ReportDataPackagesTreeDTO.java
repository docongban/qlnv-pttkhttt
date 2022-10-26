package com.laos.edu.service.dto;

import lombok.Data;

import java.util.List;
@Data
public class ReportDataPackagesTreeDTO {

    private String code;
    private String packageName;
    private String schoolCode;
    private String schoolName;
    private String levelSchool;
    private String provinceName;
    private Long total;
    private List<ReportDataPackagesDTO> chirdlen;

//    public List<ReportDataPackagesDTO> getChirdlen() {
//        return chirdlen;
//    }
//
//    public void setChirdlen(List<ReportDataPackagesDTO> chirdlen) {
//        this.chirdlen = chirdlen;
//    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public void setCode(String code) {
//        this.code = code;
//    }
//
//    public String getSchoolCode() {
//        return schoolCode;
//    }
//
//    public void setSchoolCode(String schoolCode) {
//        this.schoolCode = schoolCode;
//    }
//
//    public String getSchoolName() {
//        return schoolName;
//    }
//
//    public void setSchoolName(String schoolName) {
//        this.schoolName = schoolName;
//    }
//
//    public String getLevelSchool() {
//        return levelSchool;
//    }
//
//    public void setLevelSchool(String levelSchool) {
//        this.levelSchool = levelSchool;
//    }
//
//    public String getProvinceName() {
//        return provinceName;
//    }
//
//    public void setProvinceName(String provinceName) {
//        this.provinceName = provinceName;
//    }
//
//    public Long getTotalUser() {
//        return totalUser;
//    }
//
//    public void setTotalUser(Long totalUser) {
//        this.totalUser = totalUser;
//    }
}
