package com.laos.edu.service.dto;

import java.util.List;
import lombok.Data;

@Data
public class PackageStatisticsReturnDTO {

    private String dataPackageCode;

    private String dataPackageName;

    private String schoolCode;
    private String schoolName;
    private String levelSchool;
    private String provinceName;

    private List<PackageStatisticsResultDTO> children;

    private Long totalRegisted;

//    public String getPackageName() {
//        return packageName;
//    }
//
//    public void setPackageName(String packageName) {
//        this.packageName = packageName;
//    }
//
//    public List<PackageStatisticsResultDTO> getListPackageStatisticsResultDTO() {
//        return listPackageStatisticsResultDTO;
//    }
//
//    public void setListPackageStatisticsResultDTO(List<PackageStatisticsResultDTO> listPackageStatisticsResultDTO) {
//        this.listPackageStatisticsResultDTO = listPackageStatisticsResultDTO;
//    }
}
