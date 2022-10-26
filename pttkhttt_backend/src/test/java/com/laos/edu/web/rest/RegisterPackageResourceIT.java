package com.laos.edu.web.rest;

import com.laos.edu.LaoseduApp;
import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.repository.RegisterPackageRepository;
import com.laos.edu.service.RegisterPackageService;
import com.laos.edu.service.dto.RegisterPackageDTO;
import com.laos.edu.service.mapper.RegisterPackageMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link RegisterPackageResource} REST controller.
 */
@SpringBootTest(classes = LaoseduApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class RegisterPackageResourceIT {

    private static final Long DEFAULT_DATA_PACKAGE = 1L;
    private static final Long UPDATED_DATA_PACKAGE = 2L;

    private static final Instant DEFAULT_UPDATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_UPDATE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_STATUS = 1L;
    private static final Long UPDATED_STATUS = 2L;

    private static final Long DEFAULT_SEMESTER = 1L;
    private static final Long UPDATED_SEMESTER = 2L;

    private static final Long DEFAULT_STUDENT_ID = 1L;
    private static final Long UPDATED_STUDENT_ID = 2L;

    private static final String DEFAULT_SHOOL_YEAR = "AAAAAAAAAA";
    private static final String UPDATED_SHOOL_YEAR = "BBBBBBBBBB";

    private static final String DEFAULT_CLASS_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CLASS_CODE = "BBBBBBBBBB";

    @Autowired
    private RegisterPackageRepository registerPackageRepository;

    @Autowired
    private RegisterPackageMapper registerPackageMapper;

    @Autowired
    private RegisterPackageService registerPackageService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegisterPackageMockMvc;

    private RegisterPackage registerPackage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegisterPackage createEntity(EntityManager em) {
        RegisterPackage registerPackage = new RegisterPackage()
//            .dataPackage(DEFAULT_DATA_PACKAGE)
//            .updateTime(DEFAULT_UPDATE_TIME)
//            .updateName(DEFAULT_UPDATE_NAME)
//            .status(DEFAULT_STATUS)
//            .semester(DEFAULT_SEMESTER)
//            .studentId(DEFAULT_STUDENT_ID)
            .shoolYear(DEFAULT_SHOOL_YEAR);
//            .classCode(DEFAULT_CLASS_CODE);
        return registerPackage;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegisterPackage createUpdatedEntity(EntityManager em) {
        RegisterPackage registerPackage = new RegisterPackage()
//            .dataPackage(UPDATED_DATA_PACKAGE)
//            .updateTime(UPDATED_UPDATE_TIME)
//            .updateName(UPDATED_UPDATE_NAME)
//            .status(UPDATED_STATUS)
//            .semester(UPDATED_SEMESTER)
//            .studentId(UPDATED_STUDENT_ID)
            .shoolYear(UPDATED_SHOOL_YEAR);
//            .classCode(UPDATED_CLASS_CODE);
        return registerPackage;
    }

    @BeforeEach
    public void initTest() {
        registerPackage = createEntity(em);
    }

    @Test
    @Transactional
    public void createRegisterPackage() throws Exception {
        int databaseSizeBeforeCreate = registerPackageRepository.findAll().size();
        // Create the RegisterPackage
        RegisterPackageDTO registerPackageDTO = registerPackageMapper.toDto(registerPackage);
        restRegisterPackageMockMvc.perform(post("/api/register-packages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(registerPackageDTO)))
            .andExpect(status().isCreated());

        // Validate the RegisterPackage in the database
        List<RegisterPackage> registerPackageList = registerPackageRepository.findAll();
        assertThat(registerPackageList).hasSize(databaseSizeBeforeCreate + 1);
        RegisterPackage testRegisterPackage = registerPackageList.get(registerPackageList.size() - 1);
//        assertThat(testRegisterPackage.getDataPackage()).isEqualTo(DEFAULT_DATA_PACKAGE);
//        assertThat(testRegisterPackage.getUpdateTime()).isEqualTo(DEFAULT_UPDATE_TIME);
//        assertThat(testRegisterPackage.getUpdateName()).isEqualTo(DEFAULT_UPDATE_NAME);
//        assertThat(testRegisterPackage.getStatus()).isEqualTo(DEFAULT_STATUS);
//        assertThat(testRegisterPackage.getSemester()).isEqualTo(DEFAULT_SEMESTER);
//        assertThat(testRegisterPackage.getStudentId()).isEqualTo(DEFAULT_STUDENT_ID);
        assertThat(testRegisterPackage.getShoolYear()).isEqualTo(DEFAULT_SHOOL_YEAR);
//        assertThat(testRegisterPackage.getClassCode()).isEqualTo(DEFAULT_CLASS_CODE);
    }

    @Test
    @Transactional
    public void createRegisterPackageWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = registerPackageRepository.findAll().size();

        // Create the RegisterPackage with an existing ID
        registerPackage.setId(1L);
        RegisterPackageDTO registerPackageDTO = registerPackageMapper.toDto(registerPackage);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegisterPackageMockMvc.perform(post("/api/register-packages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(registerPackageDTO)))
            .andExpect(status().isBadRequest());

        // Validate the RegisterPackage in the database
        List<RegisterPackage> registerPackageList = registerPackageRepository.findAll();
        assertThat(registerPackageList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllRegisterPackages() throws Exception {
        // Initialize the database
        registerPackageRepository.saveAndFlush(registerPackage);

        // Get all the registerPackageList
        restRegisterPackageMockMvc.perform(get("/api/register-packages?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(registerPackage.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataPackage").value(hasItem(DEFAULT_DATA_PACKAGE.intValue())))
            .andExpect(jsonPath("$.[*].updateTime").value(hasItem(DEFAULT_UPDATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].updateName").value(hasItem(DEFAULT_UPDATE_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.intValue())))
            .andExpect(jsonPath("$.[*].semester").value(hasItem(DEFAULT_SEMESTER.intValue())))
            .andExpect(jsonPath("$.[*].studentId").value(hasItem(DEFAULT_STUDENT_ID.intValue())))
            .andExpect(jsonPath("$.[*].shoolYear").value(hasItem(DEFAULT_SHOOL_YEAR)))
            .andExpect(jsonPath("$.[*].classCode").value(hasItem(DEFAULT_CLASS_CODE)));
    }

    @Test
    @Transactional
    public void getRegisterPackage() throws Exception {
        // Initialize the database
        registerPackageRepository.saveAndFlush(registerPackage);

        // Get the registerPackage
        restRegisterPackageMockMvc.perform(get("/api/register-packages/{id}", registerPackage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(registerPackage.getId().intValue()))
            .andExpect(jsonPath("$.dataPackage").value(DEFAULT_DATA_PACKAGE.intValue()))
            .andExpect(jsonPath("$.updateTime").value(DEFAULT_UPDATE_TIME.toString()))
            .andExpect(jsonPath("$.updateName").value(DEFAULT_UPDATE_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.intValue()))
            .andExpect(jsonPath("$.semester").value(DEFAULT_SEMESTER.intValue()))
            .andExpect(jsonPath("$.studentId").value(DEFAULT_STUDENT_ID.intValue()))
            .andExpect(jsonPath("$.shoolYear").value(DEFAULT_SHOOL_YEAR))
            .andExpect(jsonPath("$.classCode").value(DEFAULT_CLASS_CODE));
    }
    @Test
    @Transactional
    public void getNonExistingRegisterPackage() throws Exception {
        // Get the registerPackage
        restRegisterPackageMockMvc.perform(get("/api/register-packages/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRegisterPackage() throws Exception {
        // Initialize the database
        registerPackageRepository.saveAndFlush(registerPackage);

        int databaseSizeBeforeUpdate = registerPackageRepository.findAll().size();

        // Update the registerPackage
        RegisterPackage updatedRegisterPackage = registerPackageRepository.findById(registerPackage.getId()).get();
        // Disconnect from session so that the updates on updatedRegisterPackage are not directly saved in db
        em.detach(updatedRegisterPackage);
        updatedRegisterPackage
//            .dataPackage(UPDATED_DATA_PACKAGE)
//            .updateTime(UPDATED_UPDATE_TIME)
//            .updateName(UPDATED_UPDATE_NAME)
//            .status(UPDATED_STATUS)
//            .semester(UPDATED_SEMESTER)
//            .studentId(UPDATED_STUDENT_ID)
            .shoolYear(UPDATED_SHOOL_YEAR);
//            .classCode(UPDATED_CLASS_CODE);
        RegisterPackageDTO registerPackageDTO = registerPackageMapper.toDto(updatedRegisterPackage);

        restRegisterPackageMockMvc.perform(put("/api/register-packages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(registerPackageDTO)))
            .andExpect(status().isOk());

        // Validate the RegisterPackage in the database
        List<RegisterPackage> registerPackageList = registerPackageRepository.findAll();
        assertThat(registerPackageList).hasSize(databaseSizeBeforeUpdate);
        RegisterPackage testRegisterPackage = registerPackageList.get(registerPackageList.size() - 1);
//        assertThat(testRegisterPackage.getDataPackage()).isEqualTo(UPDATED_DATA_PACKAGE);
//        assertThat(testRegisterPackage.getUpdateTime()).isEqualTo(UPDATED_UPDATE_TIME);
//        assertThat(testRegisterPackage.getUpdateName()).isEqualTo(UPDATED_UPDATE_NAME);
//        assertThat(testRegisterPackage.getStatus()).isEqualTo(UPDATED_STATUS);
//        assertThat(testRegisterPackage.getSemester()).isEqualTo(UPDATED_SEMESTER);
//        assertThat(testRegisterPackage.getStudentId()).isEqualTo(UPDATED_STUDENT_ID);
        assertThat(testRegisterPackage.getShoolYear()).isEqualTo(UPDATED_SHOOL_YEAR);
//        assertThat(testRegisterPackage.getClassCode()).isEqualTo(UPDATED_CLASS_CODE);
    }

    @Test
    @Transactional
    public void updateNonExistingRegisterPackage() throws Exception {
        int databaseSizeBeforeUpdate = registerPackageRepository.findAll().size();

        // Create the RegisterPackage
        RegisterPackageDTO registerPackageDTO = registerPackageMapper.toDto(registerPackage);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegisterPackageMockMvc.perform(put("/api/register-packages")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(registerPackageDTO)))
            .andExpect(status().isBadRequest());

        // Validate the RegisterPackage in the database
        List<RegisterPackage> registerPackageList = registerPackageRepository.findAll();
        assertThat(registerPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRegisterPackage() throws Exception {
        // Initialize the database
        registerPackageRepository.saveAndFlush(registerPackage);

        int databaseSizeBeforeDelete = registerPackageRepository.findAll().size();

        // Delete the registerPackage
        restRegisterPackageMockMvc.perform(delete("/api/register-packages/{id}", registerPackage.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RegisterPackage> registerPackageList = registerPackageRepository.findAll();
        assertThat(registerPackageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
