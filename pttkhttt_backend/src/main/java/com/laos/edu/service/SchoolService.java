package com.laos.edu.service;

import com.laos.edu.domain.School;
import com.laos.edu.service.dto.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service Interface for managing {@link com.laos.edu.domain.School}.
 */
public interface SchoolService {
    /**
     * Save a school.
     *
     * @param schoolDTO the entity to save.
     * @return the persisted entity.
     */
    SchoolDTO save(SchoolDTO schoolDTO);

    /**
     * Partially updates a school.
     *
     * @param schoolDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SchoolDTO> partialUpdate(SchoolDTO schoolDTO);

    /**
     * Get all the schools.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SchoolDTO> findAll(Pageable pageable);

    List<SchoolDTO> findAllByProvinceId(Long id, Long status);
    /**
     * @param code
     * @return
     */
    Optional<SchoolDTO> findOne(String code);

    /**
     * Delete the "id" school.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    ServiceResult<SchoolDTO> updateSchool(SchoolDTO schoolDTO, MultipartFile logo) throws Exception;

    List<DataPackageDTO> getRecruivePackage(String code);

    Map<String, Object> search(SearchSchoolDTO searchSchoolDTO, Integer page, Integer pageSize);

    List<SchoolDTO> exportData(SearchSchoolDTO searchSchoolDTO);

    SchoolDTO getInfor(Long id);

    List<School> findSchoolByCodeOrNameLimit50(String codeOrName);

    List<SchoolCustomDTO> getSchoolCustom(String codeOrName);

    List<SchoolCustomDTO> getSchoolLimit20();
}
