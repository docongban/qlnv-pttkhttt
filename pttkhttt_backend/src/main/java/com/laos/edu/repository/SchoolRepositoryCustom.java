package com.laos.edu.repository;


import com.laos.edu.domain.School;
import com.laos.edu.service.dto.DataPackageDTO;
import com.laos.edu.service.dto.SchoolDTO;
import com.laos.edu.service.dto.SearchSchoolDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolRepositoryCustom {
     List<DataPackageDTO> getRecruivePackage(String code);

     List<SchoolDTO> search(SearchSchoolDTO searchSchoolDTO, Integer page, Integer pageSize);

     List<SchoolDTO> exportData(SearchSchoolDTO searchSchoolDTO);

     SchoolDTO getInforSchool(Long id);

    List<SchoolDTO> findAllByProvinceId(Long id, Long status);
}
