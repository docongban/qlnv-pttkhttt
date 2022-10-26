package com.laos.edu.service.dto;

public class ContactResultDTO {

    private Long id;

    private String code;

    private String fullName;

    private String className;

    private String parents;

    private Long relationship;

    private String phone;

    private String namePackages;

    private String codePackages;

    private Long semester;

    private Long status;

    private Long gradeLevelId;

    private Long classRoomId;

    private String student;

    private Long page;

    private Long pageSize;

    private Long totalRecord;

    private String years;

    public String getCodePackages() {
        return codePackages;
    }

    public void setCodePackages(String codePackages) {
        this.codePackages = codePackages;
    }

    public String getYears() {
        return years;
    }

    public void setYears(String years) {
        this.years = years;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getParents() {
        return parents;
    }

    public void setParents(String parents) {
        this.parents = parents;
    }

    public Long getRelationship() {
        return relationship;
    }

    public void setRelationship(Long relationship) {
        this.relationship = relationship;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNamePackages() {
        return namePackages;
    }

    public void setNamePackages(String namePackages) {
        this.namePackages = namePackages;
    }

    public Long getSemester() {
        return semester;
    }

    public void setSemester(Long semester) {
        this.semester = semester;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getGradeLevelId() {
        return gradeLevelId;
    }

    public void setGradeLevelId(Long gradeLevelId) {
        this.gradeLevelId = gradeLevelId;
    }

    public Long getClassRoomId() {
        return classRoomId;
    }

    public void setClassRoomId(Long classRoomId) {
        this.classRoomId = classRoomId;
    }

    public String getStudent() {
        return student;
    }

    public void setStudent(String student) {
        this.student = student;
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

    public ContactResultDTO() {
    }

    public ContactResultDTO(Long id, String code, String fullName, String className, String parents, Long relationship, String phone, String namePackages, Long semester, Long status, Long gradeLevelId, Long classRoomId, String student, Long page, Long pageSize, Long totalRecord) {
        this.id = id;
        this.code = code;
        this.fullName = fullName;
        this.className = className;
        this.parents = parents;
        this.relationship = relationship;
        this.phone = phone;
        this.namePackages = namePackages;
        this.semester = semester;
        this.status = status;
        this.gradeLevelId = gradeLevelId;
        this.classRoomId = classRoomId;
        this.student = student;
        this.page = page;
        this.pageSize = pageSize;
        this.totalRecord = totalRecord;
    }
}
