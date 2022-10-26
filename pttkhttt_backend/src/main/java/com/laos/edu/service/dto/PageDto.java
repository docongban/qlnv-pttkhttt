package com.laos.edu.service.dto;

public class PageDto {
    private Long pageSize;
    private Long pageRecord;

    public Long getPageSize() {
        return pageSize;
    }

    public void setPageSize(Long pageSize) {
        this.pageSize = pageSize;
    }

    public Long getPageRecord() {
        return pageRecord;
    }

    public void setPageRecord(Long pageRecord) {
        this.pageRecord = pageRecord;
    }
}
