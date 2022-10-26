package com.laos.edu.service.impl;

import com.laos.edu.repository.ProvinceCustomRepository;
import com.laos.edu.service.ProvinceService;
import com.laos.edu.domain.Province;
import com.laos.edu.repository.ProvinceRepository;
import com.laos.edu.service.dto.ProvinceDTO;
import com.laos.edu.service.mapper.ProvinceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Province}.
 */
@Service
@Transactional
public class ProvinceServiceImpl implements ProvinceService {

    private final Logger log = LoggerFactory.getLogger(ProvinceServiceImpl.class);

    private final ProvinceRepository provinceRepository;

    private final ProvinceCustomRepository provinceCustomRepository;
    private final ProvinceMapper provinceMapper;

    public ProvinceServiceImpl(ProvinceRepository provinceRepository, ProvinceCustomRepository provinceCustomRepository, ProvinceMapper provinceMapper) {
        this.provinceRepository = provinceRepository;
        this.provinceCustomRepository = provinceCustomRepository;
        this.provinceMapper = provinceMapper;
    }

    @Override
    public ProvinceDTO save(ProvinceDTO provinceDTO) {
        log.debug("Request to save Province : {}", provinceDTO);
        Province province = provinceMapper.toEntity(provinceDTO);
        province = provinceRepository.save(province);
        return provinceMapper.toDto(province);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProvinceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Provinces");
        return provinceRepository.findAll(pageable)
            .map(provinceMapper::toDto);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<ProvinceDTO> findOne(Long id) {
        log.debug("Request to get Province : {}", id);
        return provinceRepository.findById(id)
            .map(provinceMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Province : {}", id);
        provinceRepository.deleteById(id);
    }

    @Override
    public List<ProvinceDTO> getSchoolAndGroupByProvince() {
        return provinceCustomRepository.getSchoolAndGroupByProvince();
    }
}
