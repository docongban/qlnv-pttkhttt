package com.laos.edu.repository;

import com.laos.edu.domain.DataPackage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data SQL repository for the DataPackage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataPackageRepository extends JpaRepository<DataPackage, Long> {

    @Query(value = "select * from data_packages where upper(code) = binary upper(?1)", nativeQuery = true)
    Optional<DataPackage> findByCode(String code);

    @Query(value = "SELECT * FROM data_packages dp WHERE true ORDER BY dp.name,dp.code", nativeQuery = true)
    List<DataPackage> findAll();
    @Query(value = "select * from data_packages where code = binary ?1", nativeQuery = true)
    Optional<DataPackage> findDataPackageByCode(String code);

    @Query(value = "select * from data_packages as a" +
        " where a.type_package = 0 and a.primary_package = ?1 " +
        " and a.quantity_semester_apply = ?2 " +
        " and (a.semester_apply = ?3 or a.semester_apply is null)" +
        " ORDER BY a.semester_apply DESC" +
        " LIMIT 1", nativeQuery = true)
    DataPackage findDataPackage(String schoolCode, int quantitySemesterApply,String semesterApply);


    @Query(value = "select * from data_packages as a" +
        " where a.type_package = 1 and a.id != ?1 ", nativeQuery = true)
    List<DataPackage> findDataPackagesByTypePackage(Long id);

    @Query(value = "select * from data_packages dp WHERE dp.level_school = ?1 AND dp.type_package = 1", nativeQuery = true)
    List<DataPackage> getAllByLevelSchool(String levelSchool);


    // Reports
    @Query(value = "select\n" +
        "dp.name as GoiCuoc, \n" +
        "s.code as MaTruong,\n" +
        "s.name as TenTruong,\n" +
        "p.pr_name as Tinh, \n" +
        "ap.name as Caphoc,\n" +
        "COUNT(*) as total\n" +
        "from register_package rp \n" +
        "join register_package_details rpd on rp.code = rpd.register_package_code\n" +
        "join data_packages dp on rpd.data_package = dp.code \n" +
        "join schools s on s.data_package_code = dp.code\n" +
        "join province p on p.pr_id = s.province_id \n" +
        "join ap_param ap on ap.code = s.level_shool ", nativeQuery = true)
    List<Object[]> reportDataPackage();

    @Query(nativeQuery = true, value = "SELECT * FROM data_packages s " +
        " WHERE (UPPER(s.code) like UPPER('%' ?1 '%') escape '&' " +
        " Or s.name like ('%' ?1 '%') escape '&' ) " +
        " ORDER BY s.name ASC,s.code limit 0,50 ")
    List<DataPackage> searchNameOrCodeLimit50(String codeOrName);
}
