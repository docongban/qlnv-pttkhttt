package com.laos.edu.repository;

import com.laos.edu.domain.School;
import com.laos.edu.domain.User;
import com.laos.edu.service.dto.SchoolCustomDTO;
import com.laos.edu.service.dto.SchoolDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the School entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    Optional<School> findByCode(String code);

    @Query(value = "SELECT * FROM schools s WHERE s.status = 1 ORDER BY s.name,s.code", nativeQuery = true)
    List<School> findAll();

    @Query(value = "SELECT * FROM schools s WHERE s.id = ?1", nativeQuery = true)
    Optional<School> findById(Long id);

    @Query(
        value = "SELECT * FROM schools s " +
        "JOIN province p ON s.province_id = p.id " +
        "WHERE 1 = 1 " +
        "AND s.code =?1 " +
        "AND s.name = ?2 or s.abbreviation_name = ?2 " +
        "AND s.level_shool = ?3 " +
        "AND p.id = ?4 " +
        "AND s.status = ?5 ",
        nativeQuery = true
    )
    List<School> search(String code, String name, String levelSchool, Long id, Long status);

    @Query(value = "SELECT * FROM schools s WHERE UPPER(s.code) = BINARY UPPER(?1)", nativeQuery = true)
    School findSchoolByCode(String code);

    @Query(
        nativeQuery = true,
        value = "SELECT * FROM schools s " +
        " WHERE (UPPER(s.code) like UPPER('%' ?1 '%') escape '&' " +
        " Or s.name like ('%' ?1 '%') escape '&' ) " +
        " and s.status = 1 ORDER BY s.name ASC,s.code ASC limit 0,50 "
    )
    List<School> searchNameOrCodeLimit50(String codeOrName);

    @Query(nativeQuery = true, value = "SELECT * from schools s \n" + "ORDER BY\n" + "\ts.name ASC,\n" + "\ts.code ASC\n" + "limit 20")
    List<School> searchLimit20();

    @Query(
        nativeQuery = true,
        value = "SELECT * from schools s \n" +
        "where UPPER(s.code) like UPPER('%' ?1 '%') or UPPER(s.name) like UPPER('%' ?1 '%')\n" +
        "ORDER BY\n" +
        "\ts.name ASC,\n" +
        "\ts.code ASC"
    )
    List<School> searchNameOrCode(String codeOrName);
}
