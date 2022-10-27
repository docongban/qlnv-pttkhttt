package com.laos.edu.repository;

import com.laos.edu.domain.Timekeeping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimekeepingRepository extends JpaRepository<Timekeeping, Integer>, TimekeepingRepositoryCustom {

}
