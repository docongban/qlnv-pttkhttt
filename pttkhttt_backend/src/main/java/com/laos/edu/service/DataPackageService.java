package com.laos.edu.service;

import com.laos.edu.domain.AppParam;
import com.laos.edu.domain.DataPackage;
import com.laos.edu.domain.School;
import com.laos.edu.service.dto.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;

import javax.xml.crypto.Data;

/**
 * Service Interface for managing {@link com.laos.edu.domain.DataPackage}.
 */
public interface DataPackageService {
    /**
     * Save a dataPackage.
     *
     * @param dataPackageDTO the entity to save.
     * @return the persisted entity.
     */
    ServiceResult<DataPackageDTO> save(DataPackageDTO dataPackageDTO);

    void savePackagePrice(DataPackageDTO dataPackageDTO);
    /**
     * Partially updates a dataPackage.
     *
     * @param dataPackageDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DataPackageDTO> partialUpdate(DataPackageDTO dataPackageDTO);

    /**
     * Get all the dataPackages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DataPackageDTO> findAll(Pageable pageable);

    /**
     * Get the "id" dataPackage.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DataPackageDTO> findOne(Long id);


    ServiceResult<DataPackageDTO> delete(DataPackageDTO dataPackageDTO);


    DataPackageResultDTO searchDataPackages(DataPackageDTO dataPackageDTO, int page, int pageSize);


    List<DataPackageDTO> getListExport(DataPackageDTO dataPackageDTO);

    List<AppParam> findAllByType(String type);

    List<DataPackageDTO> getListPrimary(Long id);

    boolean isCheckAssignedForUpdatePrimaryPackage(DataPackageDTO dataPackageDTO);

    List<ReportDataPackagesTreeDTO> reportDataPackage();


    ServiceResult<List<Boolean>> checkUpdate(DataPackageDTO dataPackageDTO);

    List<DataPackageDTO> getAllByLevelSchool(String levelSchool);

    List<ReportDataPackagesTreeDTO> report(PackageStatisticsDTO packageStatisticsDTO);


    ServiceResult<?> getListDataPackageByCode(@RequestBody RegisterPackageDTO registerPackageDTO);


    ServiceResult<?> searchPackageStatistics(@RequestBody PackageStatisticsDTO packageStatisticsDTO);

    ServiceResult<?> checkExistDataPackage(String code);

    ServiceResult<?> monthlyPackageStatistics(@RequestBody PackageStatisticsDTO packageStatisticsDTO);

    List<DataPackage> findDataPackageByCodeOrNameLimit50(String codeOrName);

    DataPackage findByCode(String code);
    List<AppParamDTO> findByPrimaryPackageCode(String primaryPackageCode);
}
