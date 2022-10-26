package com.laos.edu.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A Province.
 */
@Entity
@Table(name = "province")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Province implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prId;

    @Column(name = "pr_name")
    private String prName;

    @Column(name = "pr_name_en")
    private String prNameEn;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return prId;
    }

    public void setId(Long id) {
        this.prId = id;
    }

    public String getPrName() {
        return prName;
    }

    public Province prName(String prName) {
        this.prName = prName;
        return this;
    }

    public void setPrName(String prName) {
        this.prName = prName;
    }

    public String getPrNameEn() {
        return prNameEn;
    }

    public Province prNameEn(String prNameEn) {
        this.prNameEn = prNameEn;
        return this;
    }

    public void setPrNameEn(String prNameEn) {
        this.prNameEn = prNameEn;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Province)) {
            return false;
        }
        return prId != null && prId.equals(((Province) o).prId);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Province{" +
            "id=" + getId() +
            ", prName='" + getPrName() + "'" +
            ", prNameEn='" + getPrNameEn() + "'" +
            "}";
    }
}
