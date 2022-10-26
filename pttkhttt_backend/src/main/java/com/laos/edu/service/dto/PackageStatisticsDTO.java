package com.laos.edu.service.dto;

public class PackageStatisticsDTO {
    private int year;

    private int quarters;

    private int month;

    private String packageSearch;

    private String schoolSearch;

    private String date;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getQuarters() {
        return quarters;
    }

    public void setQuarters(int quarters) {
        this.quarters = quarters;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public String getPackageSearch() {
        return packageSearch;
    }

    public void setPackageSearch(String packageSearch) {
        this.packageSearch = packageSearch;
    }

    public String getSchoolSearch() {
        return schoolSearch;
    }

    public void setSchoolSearch(String schoolSearch) {
        this.schoolSearch = schoolSearch;
    }

    @Override
    public String toString() {
        return "PackageStatisticsDTO{" +
            "year=" + year +
            ", quarters=" + quarters +
            ", month=" + month +
            ", packageSearch='" + packageSearch + '\'' +
            ", schoolSearch='" + schoolSearch + '\'' +
            '}';
    }
}
