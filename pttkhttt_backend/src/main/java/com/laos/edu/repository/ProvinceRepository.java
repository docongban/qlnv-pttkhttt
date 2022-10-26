package com.laos.edu.repository;

import com.laos.edu.domain.Province;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Province entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {

    @Query(value = "select * from province p ORDER BY p.pr_name_en", nativeQuery = true)
    List<Province> findAll();
}
