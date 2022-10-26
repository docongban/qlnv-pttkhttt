package com.laos.edu.service.dto;

import java.util.List;

public class RegisterReportDTO {

    private RegisterPackageDetailsDTO dataStatistical;
    private List<RegisterPackageDetailsDTO> data;

    public RegisterPackageDetailsDTO getDataStatistical() {
        return dataStatistical;
    }

    public void setDataStatistical(RegisterPackageDetailsDTO dataStatistical) {
        this.dataStatistical = dataStatistical;
    }

    public List<RegisterPackageDetailsDTO> getData() {
        return data;
    }

    public void setData(List<RegisterPackageDetailsDTO> data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "RegisterReportDTO{" +
                "dataStatistical=" + dataStatistical +
                ", data=" + data +
                '}';
    }
}
