package com.laos.edu.service.dto;

import java.util.List;

public class DataPackageResultDTO {
    private List<DataPackageDTO> dataPackageDTOList;
    private int page;
    private int pageSize;
    private int total;

    public List<DataPackageDTO> getDataPackageDTOList() {
        return dataPackageDTOList;
    }

    public void setDataPackageDTOList(List<DataPackageDTO> documentaryDTOList) {
        this.dataPackageDTOList = documentaryDTOList;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}
