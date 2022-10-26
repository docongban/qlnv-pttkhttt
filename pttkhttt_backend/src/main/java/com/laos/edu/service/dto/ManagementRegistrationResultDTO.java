package com.laos.edu.service.dto;

import java.util.List;

public class ManagementRegistrationResultDTO {
    private List<ManagementRegistrationDTO> managementRegistrationDTOS;

    private Long page;

    private Long pageSize;

    private Long totalRecord;

    public List<ManagementRegistrationDTO> getManagementRegistrationDTOS() {
        return managementRegistrationDTOS;
    }

    public void setManagementRegistrationDTOS(List<ManagementRegistrationDTO> managementRegistrationDTOS) {
        this.managementRegistrationDTOS = managementRegistrationDTOS;
    }

    public Long getPage() {
        return page;
    }

    public void setPage(Long page) {
        this.page = page;
    }

    public Long getPageSize() {
        return pageSize;
    }

    public void setPageSize(Long pageSize) {
        this.pageSize = pageSize;
    }

    public Long getTotalRecord() {
        return totalRecord;
    }

    public void setTotalRecord(Long totalRecord) {
        this.totalRecord = totalRecord;
    }

    @Override
    public String toString() {
        return "ManagementRegistrationResultDTO{" +
            "managementRegistrationDTOS=" + managementRegistrationDTOS +
            ", page=" + page +
            ", pageSize=" + pageSize +
            ", totalRecord=" + totalRecord +
            '}';
    }
}
