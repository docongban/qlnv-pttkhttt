package com.laos.edu.service.dto;

public enum DataPackageEnum {
    VND(""),
    USD("USD"),
    KIP(""),
    HK1("Học kì 1"),
    HK2("Học kì 2"),
    HK3("Học kì 3"),
    HK4("Học kì 4"),

    SEMESTER1("1-Học kì 1"),
    SEMESTER2("1-Học kì 2"),
    SEMESTER3("1-Học kì 3"),
    SEMESTER4("1-Học kì 4"),

    VN("vn"),
    EN("en"),
    LA("la");



    private final String value;
    DataPackageEnum(String value){
         this.value = value;
    }

    public String getValue(){
         return value;
    }
}
