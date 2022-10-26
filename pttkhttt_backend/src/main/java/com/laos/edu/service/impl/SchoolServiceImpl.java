package com.laos.edu.service.impl;

import com.laos.edu.commons.DateUtil;
import com.laos.edu.commons.FileUtils;
import com.laos.edu.constant.AppConstants;
import com.laos.edu.domain.School;
import com.laos.edu.domain.User;
import com.laos.edu.repository.SchoolRepository;
import com.laos.edu.repository.SchoolRepositoryCustom;
import com.laos.edu.service.SchoolService;
import com.laos.edu.service.UserService;
import com.laos.edu.service.dto.*;
import com.laos.edu.service.mapper.SchoolMapper;
import java.io.File;
import java.time.Instant;
import java.util.*;
import javax.persistence.EntityManager;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service Implementation for managing {@link School}.
 */
@Service
@Transactional
public class SchoolServiceImpl implements SchoolService {

    private final Logger log = LoggerFactory.getLogger(SchoolServiceImpl.class);

    private final SchoolRepository schoolRepository;

    private final SchoolMapper schoolMapper;

    private final SchoolRepositoryCustom schoolRepositoryCustom;

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    private EntityManager entityManager;

    @Value("${save-image.path}")
    private String pathLogo;

    public SchoolServiceImpl(
        SchoolRepository schoolRepository,
        SchoolMapper schoolMapper,
        EntityManager entityManager,
        SchoolRepositoryCustom schoolRepositoryCustom,
        UserService userService,
        PasswordEncoder passwordEncoder
    ) {
        this.schoolRepository = schoolRepository;
        this.schoolMapper = schoolMapper;
        this.entityManager = entityManager;
        this.schoolRepositoryCustom = schoolRepositoryCustom;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public SchoolDTO save(SchoolDTO schoolDTO) {
        log.debug("Request to save School : {}", schoolDTO);
        School school = schoolMapper.toEntity(schoolDTO);
        Optional<User> user = userService.getUserWithAuthorities();
        String encryptedPassword = passwordEncoder.encode(school.getPassword());
        school.setHashPassword(encryptedPassword);
        if (schoolDTO.getId() == null) {
            school.setCreatedName(user.get().getLogin());
            school.setCreatedTime(Instant.now());
        }
        if (schoolDTO.getId() != null) {
            school.setUpdateTime(Instant.now());
            school.setUpdateName(user.get().getLogin());
        }
        school = schoolRepository.save(school);
        return schoolMapper.toDto(school);
    }

    @Override
    public Optional<SchoolDTO> partialUpdate(SchoolDTO schoolDTO) {
        log.debug("Request to partially update School : {}", schoolDTO);

        return schoolRepository
            .findById(schoolDTO.getId())
            .map(
                existingSchool -> {
                    schoolMapper.partialUpdate(existingSchool, schoolDTO);

                    return existingSchool;
                }
            )
            .map(schoolRepository::save)
            .map(schoolMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SchoolDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Schools");
        return schoolRepository.findAll(pageable).map(schoolMapper::toDto);
    }

    @Override
    public List<SchoolDTO> findAllByProvinceId(Long id, Long status) {
        List<SchoolDTO> listSchool = schoolRepositoryCustom.findAllByProvinceId(id, status);
        return listSchool;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SchoolDTO> findOne(String code) {
        log.debug("Request to get School : {}", code);
        return schoolRepository.findByCode(code).map(schoolMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete School : {}", id);
        schoolRepository.deleteById(id);
    }

    @Override
    public ServiceResult<SchoolDTO> updateSchool(SchoolDTO schoolDTO, MultipartFile logo) throws Exception {
        ServiceResult result = new ServiceResult();
        //            validate cac truong bat buoc
        if (StringUtils.isBlank(schoolDTO.getCode())) {
            result.setStatus(HttpStatus.NOT_MODIFIED);
            result.setMessage("msg.school.code.required");
            return result;
        }
        if (StringUtils.isBlank(schoolDTO.getName())) {
            result.setStatus(HttpStatus.NOT_MODIFIED);
            result.setMessage("msg.school.name.required");
            return result;
        }
        if (StringUtils.isBlank(schoolDTO.getPrincipal())) {
            result.setStatus(HttpStatus.NOT_MODIFIED);
            result.setMessage("msg.school.principal.required");
            return result;
        }
        if (schoolDTO.getProvinceId() == null) {
            result.setStatus(HttpStatus.NOT_MODIFIED);
            result.setMessage("msg.school.province.required");
            return result;
        }

        Optional<School> dto = schoolRepository.findByCode(schoolDTO.getCode());
        if (!dto.isPresent()) {
            result.setStatus(HttpStatus.NOT_FOUND);
            result.setMessage("msg.not-found");
            return result;
        }
        if (!dto.get().getCode().equalsIgnoreCase(schoolDTO.getCode())) {
            result.setStatus(HttpStatus.NOT_MODIFIED);
            result.setMessage("msg.school.code.not.edit");
            return result;
        }

        if (null != logo) {
            String fileName = "logo_" + schoolDTO.getCode();
            String filePath =
                this.pathLogo +
                "logo" +
                File.separator +
                schoolDTO.getCode() +
                File.separator +
                DateUtil.dateToString(new Date(), AppConstants.YYYYMMDD) +
                File.separator +
                fileName;
            FileUtils.saveFile(filePath, logo);
            schoolDTO.setLogo(FileUtils.formatPathImg(filePath));
        }
        schoolDTO.setUpdateTime(Instant.now());
        schoolDTO.setDatabase(dto.get().getDatabase());
        schoolDTO.setAccountAdmin(dto.get().getAccountAdmin());
        schoolDTO.setPassword(dto.get().getPassword());
        schoolDTO.setStatus(1l);
        School school = schoolMapper.toEntity(schoolDTO);
        schoolRepository.save(school);
        //        if (null != logo) {
        //            schoolDTO.setLogo(dto.get().getLogo());
        //        }
        result.setStatus(HttpStatus.OK);
        result.setMessage("msg.school.update.success");
        result.setData(schoolDTO);
        return result;
    }

    @Override
    public List<DataPackageDTO> getRecruivePackage(String code) {
        List<DataPackageDTO> resultList = schoolRepositoryCustom.getRecruivePackage(code);
        return resultList;
    }

    @Override
    public Map<String, Object> search(SearchSchoolDTO searchSchoolDTO, Integer page, Integer pageSize) {
        //        return (List<SchoolDTO>) schoolRepository.search(searchSchoolDTO.getCode(), searchSchoolDTO.getName(), searchSchoolDTO.getLevelSchool(), searchSchoolDTO.getProvinceId(), searchSchoolDTO.getStatus())
        //            .stream().map(schoolMapper::toDto);

        List<SchoolDTO> schoolDTOList = schoolRepositoryCustom.search(searchSchoolDTO, page, pageSize);
        Integer totalRecord = schoolRepositoryCustom.exportData(searchSchoolDTO).size();
        Map<String, Object> res = new HashMap<>();
        res.put("schoolDTOList", schoolDTOList);
        res.put("totalRecord", totalRecord);
        return res;
    }

    @Override
    public List<SchoolDTO> exportData(SearchSchoolDTO searchSchoolDTO) {
        return schoolRepositoryCustom.exportData(searchSchoolDTO);
    }

    @Override
    public SchoolDTO getInfor(Long id) {
        return schoolRepositoryCustom.getInforSchool(id);
    }

    @Override
    public List<School> findSchoolByCodeOrNameLimit50(String codeOrName) {
        return schoolRepository.searchNameOrCodeLimit50(codeOrName);
    }

    @Override
    public List<SchoolCustomDTO> getSchoolCustom(String codeOrName) {
        List<School> list = schoolRepository.searchNameOrCode(codeOrName);

        List<SchoolCustomDTO> schoolCustomDTOS = new ArrayList<>();
        for (School school : list) {
            SchoolCustomDTO schoolCustomDTO = new SchoolCustomDTO();
            schoolCustomDTO.setId(school.getId());
            schoolCustomDTO.setCode(school.getCode());
            schoolCustomDTO.setName(school.getName());
            schoolCustomDTO.setPathFe(school.getPathFe());
            schoolCustomDTO.setPathBe(school.getPathBe());

            schoolCustomDTOS.add(schoolCustomDTO);
        }

        return schoolCustomDTOS;
    }

    @Override
    public List<SchoolCustomDTO> getSchoolLimit20() {
        List<School> list = schoolRepository.searchLimit20();

        List<SchoolCustomDTO> schoolCustomDTOS = new ArrayList<>();
        for (School school : list) {
            SchoolCustomDTO schoolCustomDTO = new SchoolCustomDTO();
            schoolCustomDTO.setId(school.getId());
            schoolCustomDTO.setCode(school.getCode());
            schoolCustomDTO.setName(school.getName());
            schoolCustomDTO.setPathFe(school.getPathFe());
            schoolCustomDTO.setPathBe(school.getPathBe());

            schoolCustomDTOS.add(schoolCustomDTO);
        }

        return schoolCustomDTOS;
    }
}
