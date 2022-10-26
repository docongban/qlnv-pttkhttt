package com.laos.edu.repository;

import com.laos.edu.domain.ReportSendMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportSendMessageRepository extends JpaRepository<ReportSendMessage, Long> {

}
