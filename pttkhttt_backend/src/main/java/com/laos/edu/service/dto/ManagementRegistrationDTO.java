package com.laos.edu.service.dto;


import java.time.Instant;
import java.util.Date;

public class ManagementRegistrationDTO {

    private Long id;

    private String studentCode;

    private String studentName;

    private String phone;

    private String dataPackage;

    private Instant createDate;

    private String creator;

    private Date startDate;

    private Date endDate;

    private Date activeDate;

    private Long status;

    private String schoolName;

    private String schoolCode;

    private String fromDateSearch;

    private String toDateSearch;

    private String phoneSearch;

    private Long page;

    private Long pageSize;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDataPackage() {
        return dataPackage;
    }

    public void setDataPackage(String dataPackage) {
        this.dataPackage = dataPackage;
    }

    public Instant getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Instant createDate) {
        this.createDate = createDate;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(Date activeDate) {
        this.activeDate = activeDate;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public String getFromDateSearch() {
        return fromDateSearch;
    }

    public void setFromDateSearch(String fromDateSearch) {
        this.fromDateSearch = fromDateSearch;
    }

    public String getToDateSearch() {
        return toDateSearch;
    }

    public void setToDateSearch(String toDateSearch) {
        this.toDateSearch = toDateSearch;
    }

    public String getPhoneSearch() {
        return phoneSearch;
    }

    public void setPhoneSearch(String phoneSearch) {
        this.phoneSearch = phoneSearch;
    }

    @Override
    public String toString() {
        return "ManagementRegistrationDTO{" +
            "studentCode='" + studentCode + '\'' +
            ", studentName='" + studentName + '\'' +
            ", phone='" + phone + '\'' +
            ", dataPackage='" + dataPackage + '\'' +
            ", createDate=" + createDate +
            ", creator='" + creator + '\'' +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", activeDate=" + activeDate +
            ", status=" + status +
            ", schoolName='" + schoolName + '\'' +
            ", schoolCode='" + schoolCode + '\'' +
            ", fromDateSearch=" + fromDateSearch +
            ", toDateSearch=" + toDateSearch +
            ", phoneSearch='" + phoneSearch + '\'' +
            '}';
    }
}
