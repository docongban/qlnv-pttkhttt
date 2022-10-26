package com.laos.edu.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DataPackage.
 */
@Entity
@Table(name = "data_packages")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DataPackage implements Serializable {

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

    @Column(name = "level_school")
    private String levelSchool;

//    @Column(name = "prices", precision = 21, scale = 2)
//    private BigDecimal prices;

    @Column(name = "quantity_sms")
    private Long quantitySms;

    @Column(name = "description")
    private String description;

    @Column(name = "type_package")
    private Long typePackage;

    @Column(name = "primary_package")
    private String primaryPackage;

    @Column(name = "quantity_semester_apply")
    private Long quantitySemesterApply;

    @Column(name = "semester_apply")
    private String semesterApply;

//    @Column(name = "unit")
//    private String unit;

//    public String getUnit() {
//        return unit;
//    }
//
//    public void setUnit(String unit) {
//        this.unit = unit;
//    }

    @Column(name = "service")
    private String service;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DataPackage id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getCreatedTime() {
        return this.createdTime;
    }

    public DataPackage createdTime(Instant createdTime) {
        this.createdTime = createdTime;
        return this;
    }

    public void setCreatedTime(Instant createdTime) {
        this.createdTime = createdTime;
    }

    public String getCreatedName() {
        return this.createdName;
    }

    public DataPackage createdName(String createdName) {
        this.createdName = createdName;
        return this;
    }

    public void setCreatedName(String createdName) {
        this.createdName = createdName;
    }

    public Instant getUpdateTime() {
        return this.updateTime;
    }

    public DataPackage updateTime(Instant updateTime) {
        this.updateTime = updateTime;
        return this;
    }

    public void setUpdateTime(Instant updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateName() {
        return this.updateName;
    }

    public DataPackage updateName(String updateName) {
        this.updateName = updateName;
        return this;
    }

    public void setUpdateName(String updateName) {
        this.updateName = updateName;
    }

    public String getName() {
        return this.name;
    }

    public DataPackage name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public DataPackage code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLevelSchool() {
        return levelSchool;
    }

    public void setLevelSchool(String levelSchool) {
        this.levelSchool = levelSchool;
    }

    public DataPackage levelSchool(String levelSchool) {
        this.levelSchool = levelSchool;
        return this;
    }

//    public Long getLevelSchool() {
//        return this.levelSchool;
//    }
//
//    public DataPackage levelSchool(Long levelSchool) {
//        this.levelSchool = levelSchool;
//        return this;
//    }
//
//    public void setLevelSchool(Long levelSchool) {
//        this.levelSchool = levelSchool;
//    }
//
//    public BigDecimal getPrices() {
//        return this.prices;
//    }
//
//    public DataPackage prices(BigDecimal prices) {
//        this.prices = prices;
//        return this;
//    }
//
//    public void setPrices(BigDecimal prices) {
//        this.prices = prices;
//    }

    public Long getQuantitySms() {
        return quantitySms;
    }

    public void setQuantitySms(Long quantitySms) {
        this.quantitySms = quantitySms;
    }

//    public Long getQuantitySmsWeek() {
//        return this.quantitySmsWeek;
//    }
//
//    public DataPackage quantitySmsWeek(Long quantitySmsWeek) {
//        this.quantitySmsWeek = quantitySmsWeek;
//        return this;
//    }
//
//    public void setQuantitySmsWeek(Long quantitySmsWeek) {
//        this.quantitySmsWeek = quantitySmsWeek;
//    }

    public String getDescription() {
        return this.description;
    }

    public DataPackage description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here


    public Long getTypePackage() {
        return typePackage;
    }

    public void setTypePackage(Long typePackage) {
        this.typePackage = typePackage;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Long getQuantitySemesterApply() {
        return quantitySemesterApply;
    }

    public void setQuantitySemesterApply(Long quantitySemesterApply) {
        this.quantitySemesterApply = quantitySemesterApply;
    }

    public String getSemesterApply() {
        return semesterApply;
    }

    public void setSemesterApply(String semesterApply) {
        this.semesterApply = semesterApply;
    }

    public String getPrimaryPackage() {
        return primaryPackage;
    }

    public void setPrimaryPackage(String primaryPackage) {
        this.primaryPackage = primaryPackage;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DataPackage that = (DataPackage) o;
        return Objects.equals(id, that.id) && Objects.equals(createdTime, that.createdTime) && Objects.equals(createdName, that.createdName) && Objects.equals(updateTime, that.updateTime) && Objects.equals(updateName, that.updateName) && Objects.equals(name, that.name) && Objects.equals(code, that.code) && Objects.equals(levelSchool, that.levelSchool) && Objects.equals(quantitySms, that.quantitySms) && Objects.equals(description, that.description) && Objects.equals(typePackage, that.typePackage) && Objects.equals(primaryPackage, that.primaryPackage) && Objects.equals(quantitySemesterApply, that.quantitySemesterApply) && Objects.equals(semesterApply, that.semesterApply) && Objects.equals(service, that.service);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, createdTime, createdName, updateTime, updateName, name, code, levelSchool, quantitySms, description, typePackage, primaryPackage, quantitySemesterApply, semesterApply, service);
    }

    @Override
    public String toString() {
        return "DataPackage{" +
            "id=" + id +
            ", createdTime=" + createdTime +
            ", createdName='" + createdName + '\'' +
            ", updateTime=" + updateTime +
            ", updateName='" + updateName + '\'' +
            ", name='" + name + '\'' +
            ", code='" + code + '\'' +
            ", levelSchool='" + levelSchool + '\'' +
            ", quantitySms=" + quantitySms +
            ", description='" + description + '\'' +
            ", typePackage=" + typePackage +
            ", primaryPackage='" + primaryPackage + '\'' +
            ", quantitySemesterApply=" + quantitySemesterApply +
            ", semesterApply='" + semesterApply + '\'' +
            ", service='" + service + '\'' +
            '}';
    }
}
