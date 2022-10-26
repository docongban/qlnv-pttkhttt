package com.laos.edu.repository;

import com.laos.edu.service.dto.RegisterPackageDetailsDTO;
import com.laos.edu.service.dto.RegisterReportDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface RegisterPackageDetailsCustomRepository {


    RegisterReportDTO getData(RegisterPackageDetailsDTO registerPackageDetailsDTO);

    RegisterPackageDetailsDTO getStatistical(RegisterPackageDetailsDTO registerPackageDetailsDTO);

    Page<RegisterPackageDetailsDTO> getDetailsData(RegisterPackageDetailsDTO registerPackageDetailsDTO, int page, int size);
}
