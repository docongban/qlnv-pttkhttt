package com.laos.edu.service.dto;

import java.io.Serializable;

/**
 * A DTO for the {@link com.laos.edu.domain.Province} entity.
 */
public class ProvinceDTO implements Serializable {

    private Long id;

    private String prName;

    private String prNameEn;

    private Long numberOfSchoolPerProvince;
    private String pathSvg;

    public Long getNumberOfSchoolPerProvince() {
        return numberOfSchoolPerProvince;
    }

    public void setNumberOfSchoolPerProvince(Long numberOfSchoolPerProvince) {
        this.numberOfSchoolPerProvince = numberOfSchoolPerProvince;
    }

    public String getPathSvg() {
        return pathSvg;
    }

    public void setPathSvg(String pathSvg) {
        this.pathSvg = pathSvg;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrName() {
        return prName;
    }

    public void setPrName(String prName) {
        this.prName = prName;
    }

    public String getPrNameEn() {
        return prNameEn;
    }

    public void setPrNameEn(String prNameEn) {
        this.prNameEn = prNameEn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProvinceDTO)) {
            return false;
        }

        return id != null && id.equals(((ProvinceDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProvinceDTO{" +
            "id=" + getId() +
            ", prName='" + getPrName() + "'" +
            ", prNameEn='" + getPrNameEn() + "'" +
            "}";
    }
}
