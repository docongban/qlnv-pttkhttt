package com.laos.edu.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * A DTO for the {@link com.laos.edu.domain.DataPackage} entity.
 */
public class DataPackageDTO implements Serializable {

    private Long id;

    private Instant createdTime;

    private String createdName;

    private Instant updateTime;

    private String updateName;

    private String name;

    private String code;

    private String levelSchool;

    private BigDecimal prices;

    private String responsePrice;

    private Long quantitySms;

    private String description;

    private Long typePackage;

    private String primaryPackage;

    private Long quantitySemesterApply;

    private String semesterApply;

    private String levelSchoolName;

    private String languageType;

    private List<String> listLevelSchool;

    private String unit;

    private String levelSchoolCode;

    private String dataPackageTypeName;

    private Map<Long,String> mapPackageTypeToName;

    private Map<Long,String> quantitySemesterApplyMap;

    private String service;

    private String serviceName;

    private  List<String> listService;

    public List<String> getListLevelSchool() {
        return listLevelSchool;
    }

    public void setListLevelSchool(List<String> listLevelSchool) {
        this.listLevelSchool = listLevelSchool;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Map<Long, String> getQuantitySemesterApplyMap() {
        return quantitySemesterApplyMap;
    }

    public String getLanguageType() {
        return languageType;
    }

    public void setLanguageType(String languageType) {
        this.languageType = languageType;
    }

    public void setQuantitySemesterApplyMap(Map<Long, String> quantitySemesterApplyMap) {
        this.quantitySemesterApplyMap = quantitySemesterApplyMap;
    }

    public Map<Long, String> getMapPackageTypeToName() {
        return mapPackageTypeToName;
    }

    public void setMapPackageTypeToName(Map<Long, String> mapPackageTypeToName) {
        this.mapPackageTypeToName = mapPackageTypeToName;
    }

    public BigDecimal getPrices() {
        return prices;
    }

    public void setPrices(BigDecimal prices) {
        this.prices = prices;
    }

    public String getResponsePrice() {
        return responsePrice;
    }

    public void setResponsePrice(String responsePrice) {
        this.responsePrice = responsePrice;
    }

    public String getDataPackageTypeName() {
        return dataPackageTypeName;
    }

    public void setDataPackageTypeName(String dataPackageTypeName) {
        this.dataPackageTypeName = dataPackageTypeName;
    }


    public String getLevelSchoolName() {
        return levelSchoolName;
    }

    public void setLevelSchoolName(String levelSchoolName) {
        this.levelSchoolName = levelSchoolName;
    }

    public String getLevelSchoolCode() {
        return levelSchoolCode;
    }

    public void setLevelSchoolCode(String levelSchoolCode) {
        this.levelSchoolCode = levelSchoolCode;
    }

    private List<DataPackageDTO> childPackage;

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

    public String getLevelSchool() {
        return levelSchool;
    }

    public void setLevelSchool(String levelSchool) {
        this.levelSchool = levelSchool;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getQuantitySms() {
        return quantitySms;
    }

    public void setQuantitySms(Long quantitySms) {
        this.quantitySms = quantitySms;
    }

    public Long getTypePackage() {
        return typePackage;
    }

    public void setTypePackage(Long typePackage) {
        this.typePackage = typePackage;
    }

    public String getPrimaryPackage() {
        return primaryPackage;
    }

    public void setPrimaryPackage(String primaryPackage) {
        this.primaryPackage = primaryPackage;
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

    public List<DataPackageDTO> getChildPackage() {
        return childPackage;
    }

    public void setChildPackage(List<DataPackageDTO> childPackage) {
        this.childPackage = childPackage;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public List<String> getListService() {
        return listService;
    }

    public void setListService(List<String> listService) {
        this.listService = listService;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DataPackageDTO that = (DataPackageDTO) o;
        return Objects.equals(id, that.id) && Objects.equals(createdTime, that.createdTime) && Objects.equals(createdName, that.createdName) && Objects.equals(updateTime, that.updateTime) && Objects.equals(updateName, that.updateName) && Objects.equals(name, that.name) && Objects.equals(code, that.code) && Objects.equals(levelSchool, that.levelSchool) && Objects.equals(prices, that.prices) && Objects.equals(responsePrice, that.responsePrice) && Objects.equals(quantitySms, that.quantitySms) && Objects.equals(description, that.description) && Objects.equals(typePackage, that.typePackage) && Objects.equals(primaryPackage, that.primaryPackage) && Objects.equals(quantitySemesterApply, that.quantitySemesterApply) && Objects.equals(semesterApply, that.semesterApply) && Objects.equals(levelSchoolName, that.levelSchoolName) && Objects.equals(languageType, that.languageType) && Objects.equals(listLevelSchool, that.listLevelSchool) && Objects.equals(unit, that.unit) && Objects.equals(levelSchoolCode, that.levelSchoolCode) && Objects.equals(dataPackageTypeName, that.dataPackageTypeName) && Objects.equals(mapPackageTypeToName, that.mapPackageTypeToName) && Objects.equals(quantitySemesterApplyMap, that.quantitySemesterApplyMap) && Objects.equals(service, that.service) && Objects.equals(serviceName, that.serviceName) && Objects.equals(listService, that.listService) && Objects.equals(childPackage, that.childPackage);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, createdTime, createdName, updateTime, updateName, name, code, levelSchool, prices, responsePrice, quantitySms, description, typePackage, primaryPackage, quantitySemesterApply, semesterApply, levelSchoolName, languageType, listLevelSchool, unit, levelSchoolCode, dataPackageTypeName, mapPackageTypeToName, quantitySemesterApplyMap, service, serviceName, listService, childPackage);
    }

    @Override
    public String toString() {
        return "DataPackageDTO{" +
            "id=" + id +
            ", createdTime=" + createdTime +
            ", createdName='" + createdName + '\'' +
            ", updateTime=" + updateTime +
            ", updateName='" + updateName + '\'' +
            ", name='" + name + '\'' +
            ", code='" + code + '\'' +
            ", levelSchool='" + levelSchool + '\'' +
            ", prices=" + prices +
            ", responsePrice='" + responsePrice + '\'' +
            ", quantitySms=" + quantitySms +
            ", description='" + description + '\'' +
            ", typePackage=" + typePackage +
            ", primaryPackage='" + primaryPackage + '\'' +
            ", quantitySemesterApply=" + quantitySemesterApply +
            ", semesterApply='" + semesterApply + '\'' +
            ", levelSchoolName='" + levelSchoolName + '\'' +
            ", languageType='" + languageType + '\'' +
            ", listLevelSchool=" + listLevelSchool +
            ", unit='" + unit + '\'' +
            ", levelSchoolCode='" + levelSchoolCode + '\'' +
            ", dataPackageTypeName='" + dataPackageTypeName + '\'' +
            ", mapPackageTypeToName=" + mapPackageTypeToName +
            ", quantitySemesterApplyMap=" + quantitySemesterApplyMap +
            ", service='" + service + '\'' +
            ", serviceName='" + serviceName + '\'' +
            ", listService=" + listService +
            ", childPackage=" + childPackage +
            '}';
    }
}
