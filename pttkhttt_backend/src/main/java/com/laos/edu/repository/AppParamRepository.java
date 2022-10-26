package com.laos.edu.repository;

import com.laos.edu.domain.AppParam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Department entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppParamRepository extends JpaRepository<AppParam, Long> {
    List<AppParam> getAppParamsByTypeOrderByNameAsc(String type);

    List<AppParam> findByParentCode(String parentCode);

    @Query(value = "SELECT a.* FROM ap_param as a WHERE a.type ='DAY'", nativeQuery = true)
    List<AppParam> getListDayOfWeek();

    List<AppParam> findByCode(String code);
	List<AppParam> findAppParamByType(String type);

	@Query(value = "select * FROM ap_param as a WHERE a.type = ?1 ORDER BY a.value", nativeQuery = true)
    List<AppParam> getAllByTypeOrderByValueAsc(String type);

    @Query(value="select * from ap_param as a where a.type = ?1 order by a.name",nativeQuery = true)
    List<AppParam> getAllByTypeDataPackageService(String type);

    List<AppParam> findByCodeInAndType(List<String> code, String type);
}



