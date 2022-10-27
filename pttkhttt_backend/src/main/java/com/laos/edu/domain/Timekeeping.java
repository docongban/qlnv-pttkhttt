package com.laos.edu.domain;

import javax.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name ="timekeeping")
public class Timekeeping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "employee_code")
    private String employeeCode;

    @Column(name = "time_at")
    private Instant timeAt;

    @Column(name = "created_time")
    private Instant createdTime;

    @Column(name = "updated_time")
    private Instant updatedTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public Instant getTimeAt() {
        return timeAt;
    }

    public void setTimeAt(Instant timeAt) {
        this.timeAt = timeAt;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Instant getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Instant createdTime) {
        this.createdTime = createdTime;
    }

    public Instant getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(Instant updatedTime) {
        this.updatedTime = updatedTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Timekeeping that = (Timekeeping) o;
        return id == that.id && Objects.equals(employeeCode, that.employeeCode) && Objects.equals(timeAt, that.timeAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, employeeCode, timeAt);
    }
}
