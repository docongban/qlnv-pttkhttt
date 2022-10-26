package com.laos.edu.repository;

import com.laos.edu.domain.RegisterPackageDetails;
import com.laos.edu.service.dto.ContactResultDTO;
import com.laos.edu.service.dto.ManagementRegistrationDTO;
import com.laos.edu.service.dto.ManagementRegistrationResultDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManagementRegistrationCustomerRepository {

    public ManagementRegistrationResultDTO searchManagementRegistration(ManagementRegistrationDTO managementRegistrationDTO);

    List<RegisterPackageDetails> findToActive(List<Long> listId);
}
