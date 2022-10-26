package com.laos.edu.service.dto;

public class SearchSchoolDTO {

    private String code;
    private String name;
    private String levelSchool;
    private Long provinceId;
    private Long status;
    private String langKey;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevelSchool() {
        return levelSchool;
    }

    public void setLevelSchool(String levelSchool) {
        this.levelSchool = levelSchool;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getLangKey() {
        return langKey;
    }

    public void setLangKey(String langKey) {
        this.langKey = langKey;
    }
}
