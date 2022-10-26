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
@Table(name = "register_package")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RegisterPackage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_code")
    private String studentCode;

    @Column(name = "shool_year")
    private String shoolYear;

    @Column(name = "school_code")
    private String schoolCode;

    @Column(name = "code")
    private String code;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "phone")
    private String phone;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
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

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShoolYear() {
        return shoolYear;
    }

    public RegisterPackage shoolYear(String shoolYear) {
        this.shoolYear = shoolYear;
        return this;
    }

    public void setShoolYear(String shoolYear) {
        this.shoolYear = shoolYear;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RegisterPackage)) {
            return false;
        }
        return id != null && id.equals(((RegisterPackage) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "RegisterPackage{" +
            "id=" + id +
            ", studentCode='" + studentCode + '\'' +
            ", shoolYear='" + shoolYear + '\'' +
            ", schoolCode='" + schoolCode + '\'' +
            ", code='" + code + '\'' +
            ", studentName='" + studentName + '\'' +
            ", phone='" + phone + '\'' +
            '}';
    }
}
