package com.laos.edu.repository;

import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.domain.RegisterPackageDetails;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the RegisterPackage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RegisterPackageDetailsRepository extends JpaRepository<RegisterPackageDetails, Long>,RegisterPackageDetailsCustomRepository {

    @Query(nativeQuery = true, value="select * from register_package WHERE regis_pack_code_school = ?1 and school_code = ?2 ")
    RegisterPackage findByRegisPackCodeSchool(Long regisPackCodeSchool, String schoolCode);

    @Query(nativeQuery = true, value="select * from register_package WHERE (status = 1 or status = 2) and student_code = binary ?1 and shool_year=?2")
    List<RegisterPackage> findListRegisterPackage(String studentCode, String years);


    @Query(nativeQuery = true, value="SELECT rpd.id, rpd.status,rpd.data_package," +
        " rpd.create_date, rpd.creator, rpd.action, rpd.active_date, rpd.start_date," +
        " rpd.end_date, rpd.regis_pack_id_school, rpd.register_package_code " +
        " from" +
        " ( " +
        " select rpd.id, rpd.register_package_code,max(rpd.create_date) as createDateMax," +
        " rpd.start_date, rpd.end_date , rpd.data_package " +
        " from register_package_details rpd " +
        " join register_package rp on rpd.register_package_code= rp.code " +
        " group by binary rp.student_code, rpd.start_date, rpd.end_date " +
        " ) as tama " +
        " join register_package_details rpd on rpd.create_date = tama.createDateMax " +
        " and rpd.register_package_code= tama.register_package_code " +
        " and rpd.data_package=  tama.data_package " +
        " join register_package rp on rp.code = rpd.register_package_code" +
        " where rp.student_code = binary ?1 and rp.shool_year =?2 and rpd.status !=3")
    List<RegisterPackageDetails> findByStudentCodeAndShoolYearWithCondition(String studentCode, String years);


    RegisterPackageDetails findByRegisPackIdSchool(Long regisPackIdSchool);


    @Query(nativeQuery = true, value="SELECT rpd.id, rpd.status,rpd.data_package," +
        " rpd.create_date, rpd.creator, rpd.action, rpd.active_date, rpd.start_date," +
        " rpd.end_date, rpd.regis_pack_id_school, rpd.register_package_code " +
        " from" +
        " ( " +
        " select rpd.id,rpd.register_package_code,max(rpd.create_date) as createDateMax, " +
        " rpd.start_date, rpd.end_date , rpd.data_package  " +
        " from register_package_details rpd " +
        " join register_package rp on rpd.register_package_code= rp.code " +
        " group by binary rp.student_code, rpd.start_date, rpd.end_date " +
        " ) as tama " +
        " join register_package_details rpd on rpd.create_date = tama.createDateMax" +
        " and rpd.register_package_code= tama.register_package_code " +
        " and rpd.data_package=  tama.data_package " +
        " join register_package rp on rp.code = rpd.register_package_code" +
        " where rpd.status !=3 and Date(rpd.end_date)<Date(now())")
    List<RegisterPackageDetails> cancelRegisterPackageExpired();



    @Query(nativeQuery = true, value="SELECT rpd.id, rpd.status,rpd.data_package," +
        " rpd.create_date, rpd.creator, rpd.action, rpd.active_date, rpd.start_date," +
        " rpd.end_date, rpd.regis_pack_id_school, rpd.register_package_code " +
        " from" +
        " ( " +
        " select rpd.id,rpd.register_package_code,max(rpd.create_date) as createDateMax, " +
        " rpd.start_date, rpd.end_date , rpd.data_package  " +
        " from register_package_details rpd " +
        " join register_package rp on rpd.register_package_code= rp.code " +
        " group by binary rp.student_code, rpd.start_date, rpd.end_date " +
        " ) as tama " +
        " join register_package_details rpd on rpd.create_date = tama.createDateMax" +
        " and rpd.register_package_code= tama.register_package_code " +
        " and rpd.data_package=  tama.data_package " +
        " join register_package rp on rp.code = rpd.register_package_code" +
        " where rpd.status !=3 and Date(rpd.end_date)<Date(now()) and rpd.register_package_code = ?1 ")
    RegisterPackageDetails cancelRegisterPackageExpired(String registerPackageCode);

    @Query(nativeQuery = true, value="SELECT rpd.id, rpd.status,rpd.data_package," +
        " rpd.create_date, rpd.creator, rpd.action, rpd.active_date, rpd.start_date," +
        " rpd.end_date, rpd.regis_pack_id_school, rpd.register_package_code " +
        " from" +
        " ( " +
        " select rpd.id,rpd.register_package_code,max(rpd.create_date) as createDateMax, " +
        " rpd.start_date, rpd.end_date , rpd.data_package  " +
        " from register_package_details rpd " +
        " join register_package rp on rpd.register_package_code= rp.code " +
        " group by binary rp.student_code, rpd.start_date, rpd.end_date " +
        " ) as tama " +
        " join register_package_details rpd on rpd.create_date = tama.createDateMax" +
        " and rpd.register_package_code= tama.register_package_code " +
        " and rpd.data_package=  tama.data_package " +
        " join register_package rp on rp.code = rpd.register_package_code" +
        " WHERE status = ?1 and binary school_code= ?2 and active_date is not null and rpd.register_package_code in (?3)")
    List<RegisterPackageDetails> findRegisterPackagesByStatusAndActiveDateExists(Long status, String schoolCode, List<String> lst);


    @Query(nativeQuery = true, value="SELECT rpd.id, rpd.status,rpd.data_package," +
        " rpd.create_date, rpd.creator, rpd.action, rpd.active_date, rpd.start_date," +
        " rpd.end_date, rpd.regis_pack_id_school, rpd.register_package_code " +
        "  from " +
        " ( " +
        " select rpd.id, rpd.register_package_code,max(rpd.create_date) as createDateMax, " +
        " rpd.start_date, rpd.end_date, rpd.data_package  " +
        " from register_package_details rpd " +
        " join register_package rp on rpd.register_package_code= rp.code where (rpd.action = 0 or rpd.action = 1) " +
        " group by binary rp.student_code, rpd.start_date, rpd.end_date" +
        " ) as tama " +
        " join register_package_details rpd on rpd.create_date = tama.createDateMax " +
        " and rpd.register_package_code= tama.register_package_code " +
        " and rpd.data_package=  tama.data_package " +
        " join register_package rp on rp.code = rpd.register_package_code" +
        " where rp.student_code = binary ?1 and rp.shool_year = ?2  and rpd.active_date is not null and (rpd.action = 0 or rpd.action = 1) " +
        " limit ?3 , ?4")
    List<RegisterPackageDetails> findHistoryRegister(String studentCode, String years, Long page, Long pageSize);

    @Query(nativeQuery = true, value="SELECT count(*) " +
        "  from " +
        " ( " +
        " select rpd.id,rpd.register_package_code,max(rpd.create_date) as createDateMax, " +
        " rpd.start_date, rpd.end_date, rpd.data_package  " +
        " from register_package_details rpd " +
        " join register_package rp on rpd.register_package_code= rp.code " +
        " group by binary rp.student_code, rpd.start_date, rpd.end_date" +
        " ) as tama " +
        " join register_package_details rpd on rpd.create_date = tama.createDateMax " +
        " and rpd.register_package_code= tama.register_package_code " +
        " and rpd.data_package=  tama.data_package " +
        " join register_package rp on rp.code = rpd.register_package_code" +
        " where rp.student_code = binary ?1 and rp.shool_year = ?2  and rpd.active_date is not null and (rpd.action = 0 or rpd.action = 1) ")
    Long totalRecordHistory(String studentCode, String years);


    @Query(nativeQuery = true,
        value="SELECT rpd.* " +
            "from register_package_details rpd " +
            "left join register_package rp on rp.code = rpd.register_package_code " +
            "where rpd.active_date IS NOT NULL " +
            "and rp.school_code = ?1 " +
            "and rpd.register_package_code in (?2)")
    List<RegisterPackageDetails> getActiveRegisterPackage(String schoolCode, String rpCode);
}
