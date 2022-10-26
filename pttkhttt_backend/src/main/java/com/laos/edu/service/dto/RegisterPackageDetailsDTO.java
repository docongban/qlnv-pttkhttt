package com.laos.edu.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;
import java.util.List;

/**
 * A DTO for the {@link com.laos.edu.domain.RegisterPackage} entity.
 */
public class RegisterPackageDetailsDTO implements Serializable {

    private Long id;

    private Instant updateTime;

    private String updateName;

    private Long status;

    private String dataPackage;

    private Long semester;

    private Long studentId;

    private String classCode;

    private Instant createDate;

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

    public List<String> getListRegisterPackageCode() {
        return listRegisterPackageCode;
    }

    public void setListRegisterPackageCode(List<String> listRegisterPackageCode) {
        this.listRegisterPackageCode = listRegisterPackageCode;
    }

    private List<String> listRegisterPackageCode;

    private Long regisPackIdSchool;

    private Long idPass;

    private Long countBegin;

    private Long countBeginRegister;

    private Long countBeginCancel;

    private Long countCurrent;

    private Long countCurrentRegister;

    private Long countCurrentCancel;

    private Double countActiveEnd;

    private String ratioGrowthUser;

    private Double sumBeginPrice;

    private Double sumCurrentPrice;

    private Double sumPriceEnd;

    private String ratioGrowthPrice;

    private String fromDateBegin;

    private String toDateBegin;

    private String fromDateCurrent;

    private String toDateCurrent;

    private Long registerBegin;

    private Long cancelBegin;

    private Long registerCurrent;

    private Long cancelCurrent;

    private Long registerEnd;

    private Long cancelEnd;

    private String year;

    private String title;

    private Double priceMonth1;

    private Double priceMonth2;

    private Double priceMonth3;

    private Double priceMonth4;

    private Double priceMonth5;

    private Double priceMonth6;

    private Double priceMonth7;

    private Double priceMonth8;

    private Double priceMonth9;

    private Double priceMonth10;

    private Double priceMonth11;

    private Double priceMonth12;

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getPriceMonth1() {
        return priceMonth1;
    }

    public void setPriceMonth1(Double priceMonth1) {
        this.priceMonth1 = priceMonth1;
    }

    public Double getPriceMonth2() {
        return priceMonth2;
    }

    public void setPriceMonth2(Double priceMonth2) {
        this.priceMonth2 = priceMonth2;
    }

    public Double getPriceMonth3() {
        return priceMonth3;
    }

    public void setPriceMonth3(Double priceMonth3) {
        this.priceMonth3 = priceMonth3;
    }

    public Double getPriceMonth4() {
        return priceMonth4;
    }

    public void setPriceMonth4(Double priceMonth4) {
        this.priceMonth4 = priceMonth4;
    }

    public Double getPriceMonth5() {
        return priceMonth5;
    }

    public void setPriceMonth5(Double priceMonth5) {
        this.priceMonth5 = priceMonth5;
    }

    public Double getPriceMonth6() {
        return priceMonth6;
    }

    public void setPriceMonth6(Double priceMonth6) {
        this.priceMonth6 = priceMonth6;
    }

    public Double getPriceMonth7() {
        return priceMonth7;
    }

    public void setPriceMonth7(Double priceMonth7) {
        this.priceMonth7 = priceMonth7;
    }

    public Double getPriceMonth8() {
        return priceMonth8;
    }

    public void setPriceMonth8(Double priceMonth8) {
        this.priceMonth8 = priceMonth8;
    }

    public Double getPriceMonth9() {
        return priceMonth9;
    }

    public void setPriceMonth9(Double priceMonth9) {
        this.priceMonth9 = priceMonth9;
    }

    public Double getPriceMonth10() {
        return priceMonth10;
    }

    public void setPriceMonth10(Double priceMonth10) {
        this.priceMonth10 = priceMonth10;
    }

    public Double getPriceMonth11() {
        return priceMonth11;
    }

    public void setPriceMonth11(Double priceMonth11) {
        this.priceMonth11 = priceMonth11;
    }

    public Double getPriceMonth12() {
        return priceMonth12;
    }

    public void setPriceMonth12(Double priceMonth12) {
        this.priceMonth12 = priceMonth12;
    }


    public Long getRegisterBegin() {
        return registerBegin;
    }

    public void setRegisterBegin(Long registerBegin) {
        this.registerBegin = registerBegin;
    }

    public Long getCancelBegin() {
        return cancelBegin;
    }

    public void setCancelBegin(Long cancelBegin) {
        this.cancelBegin = cancelBegin;
    }

    public Long getRegisterCurrent() {
        return registerCurrent;
    }

    public void setRegisterCurrent(Long registerCurrent) {
        this.registerCurrent = registerCurrent;
    }

    public Long getCancelCurrent() {
        return cancelCurrent;
    }

    public void setCancelCurrent(Long cancelCurrent) {
        this.cancelCurrent = cancelCurrent;
    }

    public Long getRegisterEnd() {
        return registerEnd;
    }

    public void setRegisterEnd(Long registerEnd) {
        this.registerEnd = registerEnd;
    }

    public Long getCancelEnd() {
        return cancelEnd;
    }

    public void setCancelEnd(Long cancelEnd) {
        this.cancelEnd = cancelEnd;
    }

    public Long getCountBegin() {
        return countBegin;
    }

    public Long getCountBeginRegister() {
        return countBeginRegister;
    }

    public Long getCountBeginCancel() {
        return countBeginCancel;
    }

    public Long getCountCurrent() {
        return countCurrent;
    }

    public Long getCountCurrentRegister() {
        return countCurrentRegister;
    }

    public Long getCountCurrentCancel() {
        return countCurrentCancel;
    }

    public Double getCountActiveEnd() {
        return countActiveEnd;
    }

    public String getRatioGrowthUser() {
        return ratioGrowthUser;
    }

    public Double getSumBeginPrice() {
        return sumBeginPrice;
    }

    public Double getSumCurrentPrice() {
        return sumCurrentPrice;
    }

    public Double getSumPriceEnd() {
        return sumPriceEnd;
    }

    public String getRatioGrowthPrice() {
        return ratioGrowthPrice;
    }

    public String getFromDateBegin() {
        return fromDateBegin;
    }

    public void setFromDateBegin(String fromDateBegin) {
        this.fromDateBegin = fromDateBegin;
    }

    public String getToDateBegin() {
        return toDateBegin;
    }

    public void setToDateBegin(String toDateBegin) {
        this.toDateBegin = toDateBegin;
    }

    public String getFromDateCurrent() {
        return fromDateCurrent;
    }

    public void setFromDateCurrent(String fromDateCurrent) {
        this.fromDateCurrent = fromDateCurrent;
    }

    public String getToDateCurrent() {
        return toDateCurrent;
    }

    public void setToDateCurrent(String toDateCurrent) {
        this.toDateCurrent = toDateCurrent;
    }

    public void setCountBegin(Long countBegin) {
        this.countBegin = countBegin;
    }

    public void setCountBeginRegister(Long countBeginRegister) {
        this.countBeginRegister = countBeginRegister;
    }

    public void setCountBeginCancel(Long countBeginCancel) {
        this.countBeginCancel = countBeginCancel;
    }

    public void setCountCurrent(Long countCurrent) {
        this.countCurrent = countCurrent;
    }

    public void setCountCurrentRegister(Long countCurrentRegister) {
        this.countCurrentRegister = countCurrentRegister;
    }

    public void setCountCurrentCancel(Long countCurrentCancel) {
        this.countCurrentCancel = countCurrentCancel;
    }

    public void setCountActiveEnd(Double countActiveEnd) {
        this.countActiveEnd = countActiveEnd;
    }

    public void setRatioGrowthUser(String ratioGrowthUser) {
        this.ratioGrowthUser = ratioGrowthUser;
    }

    public void setSumBeginPrice(Double sumBeginPrice) {
        this.sumBeginPrice = sumBeginPrice;
    }

    public void setSumCurrentPrice(Double sumCurrentPrice) {
        this.sumCurrentPrice = sumCurrentPrice;
    }

    public void setSumPriceEnd(Double sumPriceEnd) {
        this.sumPriceEnd = sumPriceEnd;
    }

    public void setRatioGrowthPrice(String ratioGrowthPrice) {
        this.ratioGrowthPrice = ratioGrowthPrice;
    }

    public Long getIdPass() {
        return idPass;
    }

    public void setIdPass(Long idPass) {
        this.idPass = idPass;
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
        if (!(o instanceof RegisterPackageDetailsDTO)) {
            return false;
        }

        return id != null && id.equals(((RegisterPackageDetailsDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    public Instant getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Instant createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "RegisterPackageDetailsDTO{" +
            "id=" + id +
            ", updateTime=" + updateTime +
            ", updateName='" + updateName + '\'' +
            ", status=" + status +
            ", dataPackage='" + dataPackage + '\'' +
            ", semester=" + semester +
            ", studentId=" + studentId +
            ", classCode='" + classCode + '\'' +
            ", createDate=" + createDate +
            ", creator='" + creator + '\'' +
            ", action=" + action +
            ", activeDate=" + activeDate +
            ", classRoomId=" + classRoomId +
            ", listStudentId=" + listStudentId +
            ", listStudentCode=" + listStudentCode +
            ", listPhone=" + listPhone +
            ", listStudentName=" + listStudentName +
            ", dataPackageName='" + dataPackageName + '\'' +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", studentCode='" + studentCode + '\'' +
            ", schoolCode='" + schoolCode + '\'' +
            ", shoolYear='" + shoolYear + '\'' +
            ", regisPackCodeSchool=" + regisPackCodeSchool +
            ", studentName='" + studentName + '\'' +
            ", phone='" + phone + '\'' +
            ", registerPackageCode='" + registerPackageCode + '\'' +
            ", regisPackIdSchool=" + regisPackIdSchool +
            ", idPass=" + idPass +
            ", countBegin=" + countBegin +
            ", countBeginRegister=" + countBeginRegister +
            ", countBeginCancel=" + countBeginCancel +
            ", countCurrent=" + countCurrent +
            ", countCurrentRegister=" + countCurrentRegister +
            ", countCurrentCancel=" + countCurrentCancel +
            ", countActiveEnd=" + countActiveEnd +
            ", ratioGrowthUser='" + ratioGrowthUser + '\'' +
            ", sumBeginPrice=" + sumBeginPrice +
            ", sumCurrentPrice=" + sumCurrentPrice +
            ", sumPriceEnd=" + sumPriceEnd +
            ", ratioGrowthPrice='" + ratioGrowthPrice + '\'' +
            ", fromDateBegin='" + fromDateBegin + '\'' +
            ", toDateBegin='" + toDateBegin + '\'' +
            ", fromDateCurrent='" + fromDateCurrent + '\'' +
            ", toDateCurrent='" + toDateCurrent + '\'' +
            ", registerBegin=" + registerBegin +
            ", cancelBegin=" + cancelBegin +
            ", registerCurrent=" + registerCurrent +
            ", cancelCurrent=" + cancelCurrent +
            ", registerEnd=" + registerEnd +
            ", cancelEnd=" + cancelEnd +
            ", year='" + year + '\'' +
            ", title='" + title + '\'' +
            ", priceMonth1=" + priceMonth1 +
            ", priceMonth2=" + priceMonth2 +
            ", priceMonth3=" + priceMonth3 +
            ", priceMonth4=" + priceMonth4 +
            ", priceMonth5=" + priceMonth5 +
            ", priceMonth6=" + priceMonth6 +
            ", priceMonth7=" + priceMonth7 +
            ", priceMonth8=" + priceMonth8 +
            ", priceMonth9=" + priceMonth9 +
            ", priceMonth10=" + priceMonth10 +
            ", priceMonth11=" + priceMonth11 +
            ", priceMonth12=" + priceMonth12 +
            '}';
    }
}
