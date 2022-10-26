package com.laos.edu.repository;

import com.laos.edu.domain.Authority;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
    List<Authority> findAllByCodeIn(String[] code);

    @Query(value = "SELECT  * from jhi_authority ja WHERE ja.code not in ('ROLE_ADMIN','ROLE_USER')", nativeQuery = true)
    List<Authority> findAllNotAdminUser();
}
