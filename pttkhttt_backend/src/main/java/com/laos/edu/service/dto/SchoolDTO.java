package com.laos.edu.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * A DTO for the {@link com.laos.edu.domain.School} entity.
 */
public class SchoolDTO implements Serializable {

    private Long id;

    private Instant createdTime;

    private String createdName;

    private Instant updateTime;

    private String updateName;

    private String name;

    private String code;

    private String countryCode;

    private String contact;

    //    @JsonIgnore
    private String database;

    //    @JsonIgnore
    private String accountAdmin;

    //    @JsonIgnore
    private String password;

    private Long loginAmount;

    private String dataPackageCode;

    private Long districtId;

    private Long provinceId;

    private String abbreviationName;

    private String address;

    private String levelShool;

    private String typeEducation;

    private String districtName;

    @DateTimeFormat(style = "yyyy-MM-dd")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date createDate;

    @DateTimeFormat(style = "yyyy-MM-dd")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date foundedDate;

    private String principal;

    private String hotLine;

    private String phonePrincipal;

    private String email;

    private String website;
    private String logo;
    private DataPackageDTO schoolPackage;

    private String provinceName;

    private Long status;

    private String dataPackageName;

    private String levelSchoolName;

    private String levelSchoolNameLA;

    private String levelSchoolNameEN;

    public String getLevelSchoolNameLA() {
        return levelSchoolNameLA;
    }

    public void setLevelSchoolNameLA(String levelSchoolNameLA) {
        this.levelSchoolNameLA = levelSchoolNameLA;
    }

    public String getLevelSchoolNameEN() {
        return levelSchoolNameEN;
    }

    public void setLevelSchoolNameEN(String levelSchoolNameEN) {
        this.levelSchoolNameEN = levelSchoolNameEN;
    }

    private String statusStr;

    private String hashPassword;

    private String pathFe;

    private String pathBe;

    private Instant foundDate;

    public String getPathFe() {
        return pathFe;
    }

    public void setPathFe(String pathFe) {
        this.pathFe = pathFe;
    }

    public String getPathBe() {
        return pathBe;
    }

    public void setPathBe(String pathBe) {
        this.pathBe = pathBe;
    }

    public Instant getFoundDate() {
        return foundDate;
    }

    public void setFoundDate(Instant foundDate) {
        this.foundDate = foundDate;
    }

    public String getHashPassword() {
        return hashPassword;
    }

    public void setHashPassword(String hashPassword) {
        this.hashPassword = hashPassword;
    }

    public String getStatusStr() {
        return statusStr;
    }

    public void setStatusStr(String statusStr) {
        this.statusStr = statusStr;
    }

    public String getLevelSchoolName() {
        return levelSchoolName;
    }

    public void setLevelSchoolName(String levelSchoolName) {
        this.levelSchoolName = levelSchoolName;
    }

    public String getDataPackageName() {
        return dataPackageName;
    }

    public void setDataPackageName(String dataPackageName) {
        this.dataPackageName = dataPackageName;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Instant createdTime) {
        this.createdTime = createdTime;
    }

    public String getCreatedName() {
        return createdName;
    }

    public void setCreatedName(String createdName) {
        this.createdName = createdName;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getAccountAdmin() {
        return accountAdmin;
    }

    public void setAccountAdmin(String accountAdmin) {
        this.accountAdmin = accountAdmin;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getLoginAmount() {
        return loginAmount;
    }

    public void setLoginAmount(Long loginAmount) {
        this.loginAmount = loginAmount;
    }

    public String getDataPackageCode() {
        return dataPackageCode;
    }

    public void setDataPackageCode(String dataPackageCode) {
        this.dataPackageCode = dataPackageCode;
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getAbbreviationName() {
        return abbreviationName;
    }

    public void setAbbreviationName(String abbreviationName) {
        this.abbreviationName = abbreviationName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLevelShool() {
        return levelShool;
    }

    public void setLevelShool(String levelShool) {
        this.levelShool = levelShool;
    }

    public String getTypeEducation() {
        return typeEducation;
    }

    public void setTypeEducation(String typeEducation) {
        this.typeEducation = typeEducation;
    }

    public Date getFoundedDate() {
        return foundedDate;
    }

    public void setFoundedDate(Date foundedDate) {
        this.foundedDate = foundedDate;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    public String getHotLine() {
        return hotLine;
    }

    public void setHotLine(String hotLine) {
        this.hotLine = hotLine;
    }

    public String getPhonePrincipal() {
        return phonePrincipal;
    }

    public void setPhonePrincipal(String phonePrincipal) {
        this.phonePrincipal = phonePrincipal;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public DataPackageDTO getSchoolPackage() {
        return schoolPackage;
    }

    public void setSchoolPackage(DataPackageDTO schoolPackage) {
        this.schoolPackage = schoolPackage;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SchoolDTO)) {
            return false;
        }

        SchoolDTO schoolDTO = (SchoolDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, schoolDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return (
            "SchoolDTO{" +
            "id=" +
            id +
            ", createdTime=" +
            createdTime +
            ", createdName='" +
            createdName +
            '\'' +
            ", updateTime=" +
            updateTime +
            ", updateName='" +
            updateName +
            '\'' +
            ", name='" +
            name +
            '\'' +
            ", code='" +
            code +
            '\'' +
            ", countryCode='" +
            countryCode +
            '\'' +
            ", contact='" +
            contact +
            '\'' +
            ", database='" +
            database +
            '\'' +
            ", accountAdmin='" +
            accountAdmin +
            '\'' +
            ", password='" +
            password +
            '\'' +
            ", loginAmount=" +
            loginAmount +
            ", dataPackageCode='" +
            dataPackageCode +
            '\'' +
            ", districtId=" +
            districtId +
            ", provinceId=" +
            provinceId +
            ", abbreviationName='" +
            abbreviationName +
            '\'' +
            ", address='" +
            address +
            '\'' +
            ", levelShool='" +
            levelShool +
            '\'' +
            ", typeEducation='" +
            typeEducation +
            '\'' +
            ", foundedDate=" +
            foundedDate +
            ", principal='" +
            principal +
            '\'' +
            ", hotLine='" +
            hotLine +
            '\'' +
            ", phonePrincipal='" +
            phonePrincipal +
            '\'' +
            ", email='" +
            email +
            '\'' +
            ", website='" +
            website +
            '\'' +
            '}'
        );
    }
}
