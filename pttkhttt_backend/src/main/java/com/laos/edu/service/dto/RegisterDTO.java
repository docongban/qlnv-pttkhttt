package com.laos.edu.service.dto;

import java.util.List;

public class RegisterDTO {
    private List<RegisterPackageDTO> registerPackageDTOList;

    private List<RegisterPackageDetailsDTO> registerPackageDetailsDTOList;

    private List<String> studentCodeList;

    private List<RegisterPackageDetailsDTO> autoCancelRegisterPackageDetailsDTOList;

    private String SchoolYear;

    public List<RegisterPackageDetailsDTO> getAutoCancelRegisterPackageDetailsDTOList() {
        return autoCancelRegisterPackageDetailsDTOList;
    }

    public void setAutoCancelRegisterPackageDetailsDTOList(List<RegisterPackageDetailsDTO> autoCancelRegisterPackageDetailsDTOList) {
        this.autoCancelRegisterPackageDetailsDTOList = autoCancelRegisterPackageDetailsDTOList;
    }

    public String getSchoolYear() {
        return SchoolYear;
    }

    public void setSchoolYear(String schoolYear) {
        SchoolYear = schoolYear;
    }

    public List<String> getStudentCodeList() {
        return studentCodeList;
    }

    public void setStudentCodeList(List<String> studentCodeList) {
        this.studentCodeList = studentCodeList;
    }

    public List<RegisterPackageDTO> getRegisterPackageDTOList() {
        return registerPackageDTOList;
    }

    public void setRegisterPackageDTOList(List<RegisterPackageDTO> registerPackageDTOList) {
        this.registerPackageDTOList = registerPackageDTOList;
    }

    public List<RegisterPackageDetailsDTO> getRegisterPackageDetailsDTOList() {
        return registerPackageDetailsDTOList;
    }

    public void setRegisterPackageDetailsDTOList(List<RegisterPackageDetailsDTO> registerPackageDetailsDTOList) {
        this.registerPackageDetailsDTOList = registerPackageDetailsDTOList;
    }
}
