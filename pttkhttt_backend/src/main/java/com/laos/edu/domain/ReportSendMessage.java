package com.laos.edu.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@Entity
@Table(name = "report_send_message")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ReportSendMessage {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "school_code")
    private String schoolCode;

    @Column(name = "package_code")
    private String packageCode;

    @Column(name = "year")
    private String year;

    @Column(name = "number_send_sms")
    private Double numberSendSms;

    @Column(name = "month")
    private Integer month;

    public ReportSendMessage() {
    }

    public ReportSendMessage(Long id, String schoolCode, String packageCode, String year, Double numberSendSms, Integer month) {
        this.id = id;
        this.schoolCode = schoolCode;
        this.packageCode = packageCode;
        this.year = year;
        this.numberSendSms = numberSendSms;
        this.month = month;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Double getNumberSendSms() {
        return numberSendSms;
    }

    public void setNumberSendSms(Double numberSendSms) {
        this.numberSendSms = numberSendSms;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    @Override
    public String toString() {
        return "ReportSendMessage{" +
            "id=" + id +
            ", schoolCode='" + schoolCode + '\'' +
            ", packageCode='" + packageCode + '\'' +
            ", year='" + year + '\'' +
            ", numberSendSms=" + numberSendSms +
            ", month=" + month +
            '}';
    }
}
