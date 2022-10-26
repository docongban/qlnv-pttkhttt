package com.laos.edu.repository;

import com.laos.edu.service.dto.ContactResultDTO;
import com.laos.edu.service.dto.PackageStatisticsByMonthDTO;
import com.laos.edu.service.dto.PackageStatisticsDTO;
import com.laos.edu.service.dto.PackageStatisticsResultDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageStatisticsCustomerRepository {
    public List<PackageStatisticsResultDTO> searchPackageStatistics(PackageStatisticsDTO packageStatisticsDTO, String language);

    List<PackageStatisticsByMonthDTO> monthlyStatistics(PackageStatisticsDTO packageStatisticsDTO);
}
