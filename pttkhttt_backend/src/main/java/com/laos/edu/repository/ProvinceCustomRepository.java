package com.laos.edu.repository;

import com.laos.edu.service.dto.ProvinceDTO;

import java.util.List;

/**
 * Spring Data  repository for the Contacts entity.
 */
@SuppressWarnings("unused")

public interface ProvinceCustomRepository {
    List<ProvinceDTO> getSchoolAndGroupByProvince();
}
