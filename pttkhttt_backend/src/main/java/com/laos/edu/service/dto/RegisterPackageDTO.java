package com.laos.edu.service.dto;

import java.time.Instant;
import java.io.Serializable;
import java.util.List;

/**
 * A DTO for the {@link com.laos.edu.domain.RegisterPackage} entity.
 */
public class RegisterPackageDTO implements Serializable {

    private Long id;

    private Instant updateTime;

    private String updateName;

    private Long status;

    private String dataPackage;

    private Long semester;

    private Long studentId;

    private String classCode;

    private Instant create_date;

    private String creator;

    private long action;

    private Instant activeDate;

    private Long classRoomId;

    private List<Long> listStudentId;

    private List<String> listStudentCode;

    private List<String> listPhone;

    private List<String> listStudentName;

    private String dataPackageName;

    private Instant startDate;

    private Instant endDate;

    private String studentCode;

    private String schoolCode;

    private String shoolYear;

    private long regisPackCodeSchool;

    private String studentName;

    private String phone;

    private String registerPackageCode;

    private Long regisPackIdSchool;

    private String code;

    private List<Long> listIdRegisterPackageDetail;

    private Long page;

    private Long pageSize;

    private List<String> dataPackageCode;

    public List<String> getDataPackageCode() {
        return dataPackageCode;
    }

    public void setDataPackageCode(List<String> dataPackageCode) {
        this.dataPackageCode = dataPackageCode;
    }

    public List<Long> getListIdRegisterPackageDetail() {
        return listIdRegisterPackageDetail;
    }

    public void setListIdRegisterPackageDetail(List<Long> listIdRegisterPackageDetail) {
        this.listIdRegisterPackageDetail = listIdRegisterPackageDetail;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getRegisterPackageCode() {
        return registerPackageCode;
    }

    public void setRegisterPackageCode(String registerPackageCode) {
        this.registerPackageCode = registerPackageCode;
    }

    public Long getRegisPackIdSchool() {
        return regisPackIdSchool;
    }

    public void setRegisPackIdSchool(Long regisPackIdSchool) {
        this.regisPackIdSchool = regisPackIdSchool;
    }

    public List<String> getListStudentCode() {
        return listStudentCode;
    }

    public void setListStudentCode(List<String> listStudentCode) {
        this.listStudentCode = listStudentCode;
    }

    public List<String> getListPhone() {
        return listPhone;
    }

    public void setListPhone(List<String> listPhone) {
        this.listPhone = listPhone;
    }

    public List<String> getListStudentName() {
        return listStudentName;
    }

    public void setListStudentName(List<String> listStudentName) {
        this.listStudentName = listStudentName;
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

    public Long getSemester() {
        return semester;
    }

    public void setSemester(Long semester) {
        this.semester = semester;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public void setDataPackage(String dataPackage) {
        this.dataPackage = dataPackage;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public long getRegisPackCodeSchool() {
        return regisPackCodeSchool;
    }

    public void setRegisPackCodeSchool(long regisPackCodeSchool) {
        this.regisPackCodeSchool = regisPackCodeSchool;
    }

    public String getDataPackageName() {
        return dataPackageName;
    }

    public void setDataPackageName(String dataPackageName) {
        this.dataPackageName = dataPackageName;
    }

    public List<Long> getListStudentId() {
        return listStudentId;
    }

    public void setListStudentId(List<Long> listStudentId) {
        this.listStudentId = listStudentId;
    }

    public Instant getCreate_date() {
        return create_date;
    }

    public void setCreate_date(Instant create_date) {
        this.create_date = create_date;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public long getAction() {
        return action;
    }

    public void setAction(long action) {
        this.action = action;
    }

    public Instant getActiveDate() {
        return activeDate;
    }

    public void setActiveDate(Instant activeDate) {
        this.activeDate = activeDate;
    }

    public Long getClassRoomId() {
        return classRoomId;
    }

    public void setClassRoomId(Long classRoomId) {
        this.classRoomId = classRoomId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDataPackage() {
        return dataPackage;
    }

    public Instant getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Instant updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateName() {
        return updateName;
    }

    public void setUpdateName(String updateName) {
        this.updateName = updateName;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getShoolYear() {
        return shoolYear;
    }

    public void setShoolYear(String shoolYear) {
        this.shoolYear = shoolYear;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RegisterPackageDTO)) {
            return false;
        }

        return id != null && id.equals(((RegisterPackageDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "RegisterPackageDTO{" +
            "id=" + id +
            ", updateTime=" + updateTime +
            ", updateName='" + updateName + '\'' +
            ", status=" + status +
            ", dataPackage='" + dataPackage + '\'' +
            ", studentId=" + studentId +
            ", shoolYear='" + shoolYear + '\'' +
            ", classCode='" + classCode + '\'' +
            ", create_date=" + create_date +
            ", creator='" + creator + '\'' +
            ", action=" + action +
            ", activeDate=" + activeDate +
            ", schoolCode='" + schoolCode + '\'' +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", regisPackCodeSchool=" + regisPackCodeSchool +
            ", classRoomId=" + classRoomId +
            ", listStudentId=" + listStudentId +
            ", dataPackageName='" + dataPackageName + '\'' +
            ", studentCode='" + studentCode + '\'' +
            ", semester=" + semester +
            ", studentName='" + studentName + '\'' +
            ", phone='" + phone + '\'' +
            '}';
    }
}
