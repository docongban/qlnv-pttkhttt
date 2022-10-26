package com.laos.edu.service;

import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.domain.RegisterPackageDetails;
import com.laos.edu.service.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.laos.edu.domain.RegisterPackage}.
 */
public interface RegisterPackageService {

    /**
     * Save a registerPackage.
     *
     * @param registerPackageDTO the entity to save.
     * @return the persisted entity.
     */
    RegisterPackageDTO save(RegisterPackageDTO registerPackageDTO);

    /**
     * Get all the registerPackages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<RegisterPackageDTO> findAll(Pageable pageable);


    /**
     * Get the "id" registerPackage.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<RegisterPackageDTO> findOne(Long id);

    /**
     * Delete the "id" registerPackage.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    ServiceResult<List<RegisterPackageDTO>> saveRegisterPackage(RegisterDTO registerDTO);

    ServiceResult<RegisterPackageDTO> cancelRegisterPackage(@RequestBody RegisterPackageDetailsDTO registerPackageDetailsDTO);

    ServiceResult<List<RegisterPackageDetails>> findRegisterPackagesByStatusAndActiveDateExits(String schoolCode, List<String> lst);

    ServiceResult<String> cancelRegisterPackageExpired(ServiceResult<List<RegisterPackageDetails>> result);

    ManagementRegistrationResultDTO searchManagementRegistration(ManagementRegistrationDTO managementRegistrationDTO);

    ServiceResult<RegisterHistoryDTO> getHistoryRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO);

    ServiceResult<String> activeRegisterPackage(@RequestBody RegisterPackageDTO registerPackageDTO);
}
