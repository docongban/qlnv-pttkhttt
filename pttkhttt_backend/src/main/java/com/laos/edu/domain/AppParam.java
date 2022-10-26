package com.laos.edu.domain;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ap_param")
public class AppParam {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "name_la")
    private String nameLA;

    @Column(name = "name_en")
    private String nameEN;

    @Column(name = "code")
    private String code;

    @Column(name = "value")
    private String value;

    @Column(name = "parent_code")
    private String parentCode;

    @Column(name = "type")
    private String type;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String concatCodeName(){
        return getValue()+"-"+getName();
    }

    public String getNameLA() {
        return nameLA;
    }

    public void setNameLA(String nameLA) {
        this.nameLA = nameLA;
    }

    public String getNameEN() {
        return nameEN;
    }

    public void setNameEN(String nameEN) {
        this.nameEN = nameEN;
    }
}
