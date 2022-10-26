package com.laos.edu.service.dto;

import java.time.Instant;
import java.util.Date;

import lombok.Data;

@Data
public class PackageStatisticsResultDTO {

    private String schoolId;

    private String schoolCode;

    private String schoolName;

    private String levelSchoolName;

    private String provinceName;

    private String dataPackageCode;

    private String dataPackageName;

    private String dataPackageCodeRegistered;

    private Long countRegister1PackageOf1School;

    private Instant create_date;

    private Date end_date;

    private Long totalRegistration;

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getLevelSchoolName() {
        return levelSchoolName;
    }

    public void setLevelSchoolName(String levelSchoolName) {
        this.levelSchoolName = levelSchoolName;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public String getDataPackageCode() {
        return dataPackageCode;
    }

    public void setDataPackageCode(String dataPackageCode) {
        this.dataPackageCode = dataPackageCode;
    }

    public String getDataPackageName() {
        return dataPackageName;
    }

    public void setDataPackageName(String dataPackageName) {
        this.dataPackageName = dataPackageName;
    }

    public String getDataPackageCodeRegistered() {
        return dataPackageCodeRegistered;
    }

    public void setDataPackageCodeRegistered(String dataPackageCodeRegistered) {
        this.dataPackageCodeRegistered = dataPackageCodeRegistered;
    }

    public Long getCountRegister1PackageOf1School() {
        return countRegister1PackageOf1School;
    }

    public void setCountRegister1PackageOf1School(Long countRegister1PackageOf1School) {
        this.countRegister1PackageOf1School = countRegister1PackageOf1School;
    }

    public Instant getCreate_date() {
        return create_date;
    }

    public void setCreate_date(Instant create_date) {
        this.create_date = create_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }

    public Long getTotalRegistration() {
        return totalRegistration;
    }

    public void setTotalRegistration(Long totalRegistration) {
        this.totalRegistration = totalRegistration;
    }

    @Override
    public String toString() {
        return "PackageStatisticsResultDTO{" +
            "schoolCode='" + schoolCode + '\'' +
            ", schoolName='" + schoolName + '\'' +
            ", levelSchoolName='" + levelSchoolName + '\'' +
            ", provinceName='" + provinceName + '\'' +
            ", dataPackageCode='" + dataPackageCode + '\'' +
            ", dataPackageName='" + dataPackageName + '\'' +
            ", dataPackageCodeRegistered='" + dataPackageCodeRegistered + '\'' +
            ", countRegister1PackageOf1School=" + countRegister1PackageOf1School +
            ", create_date=" + create_date +
            ", end_date=" + end_date +
            ", totalRegistration=" + totalRegistration +
            '}';
    }
}
