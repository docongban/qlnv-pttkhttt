package com.laos.edu.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A RegisterPackage.
 */
@Entity
@Table(name = "register_package_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RegisterPackageDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status")
    private Long status;

    @Column(name = "data_package")
    private String dataPackage;

    @Column(name = "create_date")
    private Instant createDate;

    @Column(name = "creator")
    private String creator;

    @Column(name = "action")
    private long action;

    @Column(name = "active_date")
    private Instant activeDate;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "regis_pack_id_school")
    private long regisPackIdSchool;

    @Column(name = "register_package_code")
    private String registerPackageCode;

    public long getRegisPackIdSchool() {
        return regisPackIdSchool;
    }

    public void setRegisPackIdSchool(long regisPackIdSchool) {
        this.regisPackIdSchool = regisPackIdSchool;
    }

    public String getRegisterPackageCode() {
        return registerPackageCode;
    }

    public void setRegisterPackageCode(String registerPackageCode) {
        this.registerPackageCode = registerPackageCode;
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

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Instant getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Instant createDate) {
        this.createDate = createDate;
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

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDataPackage() {
        return dataPackage;
    }

    public RegisterPackageDetails dataPackage(String dataPackage) {
        this.dataPackage = dataPackage;
        return this;
    }

    public void setDataPackage(String dataPackage) {
        this.dataPackage = dataPackage;
    }

    public Long getStatus() {
        return status;
    }

    public RegisterPackageDetails status(Long status) {
        this.status = status;
        return this;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RegisterPackageDetails)) {
            return false;
        }
        return id != null && id.equals(((RegisterPackageDetails) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "RegisterPackageDetails{" +
            "id=" + id +
            ", status=" + status +
            ", dataPackage='" + dataPackage + '\'' +
            ", createDate=" + createDate +
            ", creator='" + creator + '\'' +
            ", action=" + action +
            ", activeDate=" + activeDate +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", regisPackIdSchool=" + regisPackIdSchool +
            ", registerPackageCode='" + registerPackageCode + '\'' +
            '}';
    }
}
