package com.laos.edu.service.dto;

import java.util.List;

public class RegisterHistoryDTO {
    List<RegisterPackageDetailsDTO> registerPackageDetailsDTOList;

    private Long totalRecord;

    public List<RegisterPackageDetailsDTO> getRegisterPackageDetailsDTOList() {
        return registerPackageDetailsDTOList;
    }

    public void setRegisterPackageDetailsDTOList(List<RegisterPackageDetailsDTO> registerPackageDetailsDTOList) {
        this.registerPackageDetailsDTOList = registerPackageDetailsDTOList;
    }

    public Long getTotalRecord() {
        return totalRecord;
    }

    public void setTotalRecord(Long totalRecord) {
        this.totalRecord = totalRecord;
    }
}
