package com.laos.edu.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.laos.edu.service.dto.DataPackageDTO;
import java.io.Serializable;
import java.time.Instant;
import java.util.Date;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * A School.
 */
@Entity
@Table(name = "schools")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class School implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_time")
    private Instant createdTime;

    @Column(name = "created_name")
    private String createdName;

    @Column(name = "update_time")
    private Instant updateTime;

    @Column(name = "update_name")
    private String updateName;

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    //    @Column(name = "country_code")
    //    private String countryCode;

    @Column(name = "contact")
    private String contact;

    //    @Column(name = "jhi_database")
    @Column(name = "database_config")
    private String database;

    @Column(name = "account_admin")
    private String accountAdmin;

    @Column(name = "password")
    private String password;

    @Column(name = "login_amount")
    private Long loginAmount;

    @Column(name = "data_package_code")
    private String dataPackageCode;

    @Column(name = "district_id")
    private Long districtId;

    @Column(name = "province_id")
    private Long provinceId;

    @Column(name = "abbreviation_name")
    private String abbreviationName;

    @Column(name = "address")
    private String address;

    @Column(name = "level_shool")
    private String levelShool;

    @Column(name = "type_education")
    private String typeEducation;

    @Column(name = "founded_date")
    @DateTimeFormat(style = "yyyy-MM-dd")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date foundedDate;

    @Column(name = "principal")
    private String principal;

    @Column(name = "hot_line")
    private String hotLine;

    @Column(name = "phone_principal")
    private String phonePrincipal;

    @Column(name = "email")
    private String email;

    @Column(name = "website")
    private String website;

    @Column(name = "logo")
    private String logo;

    @Column(name = "status")
    private Long status;

    @Column(name = "hash_password")
    private String hashPassword;

    @Column(name = "path_fe")
    private String pathFe;

    @Column(name = "path_be")
    private String pathBe;

    public String getHashPassword() {
        return hashPassword;
    }

    public void setHashPassword(String hashPassword) {
        this.hashPassword = hashPassword;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
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

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    //    @Column(name = "payment_status")
    //    private Long paymentStatus;
    //
    //    @Column(name = "level_school")
    //    private Long levelSchool;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public School id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getCreatedTime() {
        return this.createdTime;
    }

    public School createdTime(Instant createdTime) {
        this.createdTime = createdTime;
        return this;
    }

    public void setCreatedTime(Instant createdTime) {
        this.createdTime = createdTime;
    }

    public String getCreatedName() {
        return this.createdName;
    }

    public School createdName(String createdName) {
        this.createdName = createdName;
        return this;
    }

    public void setCreatedName(String createdName) {
        this.createdName = createdName;
    }

    public Instant getUpdateTime() {
        return this.updateTime;
    }

    public School updateTime(Instant updateTime) {
        this.updateTime = updateTime;
        return this;
    }

    public void setUpdateTime(Instant updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateName() {
        return this.updateName;
    }

    public School updateName(String updateName) {
        this.updateName = updateName;
        return this;
    }

    public void setUpdateName(String updateName) {
        this.updateName = updateName;
    }

    public String getName() {
        return this.name;
    }

    public School name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public School code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    //    public Long getTypeEducation() {
    //        return this.typeEducation;
    //    }
    //
    //    public School typeEducation(Long typeEducation) {
    //        this.typeEducation = typeEducation;
    //        return this;
    //    }

    //    public void setTypeEducation(Long typeEducation) {
    //        this.typeEducation = typeEducation;
    //    }

    //    public String getCountryCode() {
    //        return this.countryCode;
    //    }
    //
    //    public School countryCode(String countryCode) {
    //        this.countryCode = countryCode;
    //        return this;
    //    }
    //
    //    public void setCountryCode(String countryCode) {
    //        this.countryCode = countryCode;
    //    }

    public String getContact() {
        return this.contact;
    }

    public School contact(String contact) {
        this.contact = contact;
        return this;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDatabase() {
        return this.database;
    }

    public School database(String database) {
        this.database = database;
        return this;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getAccountAdmin() {
        return this.accountAdmin;
    }

    public School accountAdmin(String accountAdmin) {
        this.accountAdmin = accountAdmin;
        return this;
    }

    public void setAccountAdmin(String accountAdmin) {
        this.accountAdmin = accountAdmin;
    }

    public String getPassword() {
        return this.password;
    }

    public School password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getLoginAmount() {
        return this.loginAmount;
    }

    public School loginAmount(Long loginAmount) {
        this.loginAmount = loginAmount;
        return this;
    }

    public void setLoginAmount(Long loginAmount) {
        this.loginAmount = loginAmount;
    }

    public String getDataPackageCode() {
        return this.dataPackageCode;
    }

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

    public School dataPackageCode(String dataPackageCode) {
        this.dataPackageCode = dataPackageCode;
        return this;
    }

    public void setDataPackageCode(String dataPackageCode) {
        this.dataPackageCode = dataPackageCode;
    }

    //    public Long getPaymentStatus() {
    //        return this.paymentStatus;
    //    }
    //
    //    public School paymentStatus(Long paymentStatus) {
    //        this.paymentStatus = paymentStatus;
    //        return this;
    //    }

    //    public void setPaymentStatus(Long paymentStatus) {
    //        this.paymentStatus = paymentStatus;
    //    }
    //
    //    public Long getLevelSchool() {
    //        return this.levelSchool;
    //    }
    //
    //    public School levelSchool(Long levelSchool) {
    //        this.levelSchool = levelSchool;
    //        return this;
    //    }
    //
    //    public void setLevelSchool(Long levelSchool) {
    //        this.levelSchool = levelSchool;
    //    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof School)) {
            return false;
        }
        return id != null && id.equals(((School) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return (
            "School{" +
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
            ", logo='" +
            logo +
            '\'' +
            '}'
        );
    }
}
