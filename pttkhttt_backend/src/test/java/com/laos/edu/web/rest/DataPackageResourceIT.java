package com.laos.edu.web.rest;

import com.laos.edu.IntegrationTest;
import com.laos.edu.domain.DataPackage;
import com.laos.edu.repository.DataPackageRepository;
import com.laos.edu.service.dto.DataPackageDTO;
import com.laos.edu.service.mapper.DataPackageMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

import static com.laos.edu.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link DataPackageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DataPackageResourceIT {

    private static final Instant DEFAULT_CREATED_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CREATED_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_UPDATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_UPDATE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_UPDATE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_LEVEL_SCHOOL = "AAAAAAAAAA";
    private static final String UPDATED_LEVEL_SCHOOL = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRICES = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICES = new BigDecimal(2);

    private static final Long DEFAULT_QUANTITY_SMS_YEAR = 1L;
    private static final Long UPDATED_QUANTITY_SMS_YEAR = 2L;

    private static final Long DEFAULT_QUANTITY_SMS_WEEK = 1L;
    private static final Long UPDATED_QUANTITY_SMS_WEEK = 2L;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/data-packages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DataPackageRepository dataPackageRepository;

    @Autowired
    private DataPackageMapper dataPackageMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDataPackageMockMvc;

    private DataPackage dataPackage;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DataPackage createEntity(EntityManager em) {
        DataPackage dataPackage = new DataPackage()
            .createdTime(DEFAULT_CREATED_TIME)
            .createdName(DEFAULT_CREATED_NAME)
            .updateTime(DEFAULT_UPDATE_TIME)
            .updateName(DEFAULT_UPDATE_NAME)
            .name(DEFAULT_NAME)
            .code(DEFAULT_CODE)
            .levelSchool(DEFAULT_LEVEL_SCHOOL)
//            .prices(DEFAULT_PRICES)
//            .quantitySmsYear(DEFAULT_QUANTITY_SMS_YEAR)
//            .quantitySmsWeek(DEFAULT_QUANTITY_SMS_WEEK)
            .description(DEFAULT_DESCRIPTION);
        return dataPackage;
    }

    /**
     * Create an updated entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DataPackage createUpdatedEntity(EntityManager em) {
        DataPackage dataPackage = new DataPackage()
            .createdTime(UPDATED_CREATED_TIME)
            .createdName(UPDATED_CREATED_NAME)
            .updateTime(UPDATED_UPDATE_TIME)
            .updateName(UPDATED_UPDATE_NAME)
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .levelSchool(UPDATED_LEVEL_SCHOOL)
//            .prices(UPDATED_PRICES)
//            .quantitySmsYear(UPDATED_QUANTITY_SMS_YEAR)
//            .quantitySmsWeek(UPDATED_QUANTITY_SMS_WEEK)
            .description(UPDATED_DESCRIPTION);
        return dataPackage;
    }

    @BeforeEach
    public void initTest() {
        dataPackage = createEntity(em);
    }

    @Test
    @Transactional
    void createDataPackage() throws Exception {
        int databaseSizeBeforeCreate = dataPackageRepository.findAll().size();
        // Create the DataPackage
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);
        restDataPackageMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isCreated());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeCreate + 1);
        DataPackage testDataPackage = dataPackageList.get(dataPackageList.size() - 1);
        assertThat(testDataPackage.getCreatedTime()).isEqualTo(DEFAULT_CREATED_TIME);
        assertThat(testDataPackage.getCreatedName()).isEqualTo(DEFAULT_CREATED_NAME);
        assertThat(testDataPackage.getUpdateTime()).isEqualTo(DEFAULT_UPDATE_TIME);
        assertThat(testDataPackage.getUpdateName()).isEqualTo(DEFAULT_UPDATE_NAME);
        assertThat(testDataPackage.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDataPackage.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testDataPackage.getLevelSchool()).isEqualTo(DEFAULT_LEVEL_SCHOOL);
//        assertThat(testDataPackage.getPrices()).isEqualByComparingTo(DEFAULT_PRICES);
//        assertThat(testDataPackage.getQuantitySmsYear()).isEqualTo(DEFAULT_QUANTITY_SMS_YEAR);
//        assertThat(testDataPackage.getQuantitySmsWeek()).isEqualTo(DEFAULT_QUANTITY_SMS_WEEK);
        assertThat(testDataPackage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createDataPackageWithExistingId() throws Exception {
        // Create the DataPackage with an existing ID
        dataPackage.setId(1L);
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);

        int databaseSizeBeforeCreate = dataPackageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataPackageMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDataPackages() throws Exception {
        // Initialize the database
        dataPackageRepository.saveAndFlush(dataPackage);

        // Get all the dataPackageList
        restDataPackageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataPackage.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdTime").value(hasItem(DEFAULT_CREATED_TIME.toString())))
            .andExpect(jsonPath("$.[*].createdName").value(hasItem(DEFAULT_CREATED_NAME)))
            .andExpect(jsonPath("$.[*].updateTime").value(hasItem(DEFAULT_UPDATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].updateName").value(hasItem(DEFAULT_UPDATE_NAME)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].levelSchool").value(hasItem(DEFAULT_LEVEL_SCHOOL)))
            .andExpect(jsonPath("$.[*].prices").value(hasItem(sameNumber(DEFAULT_PRICES))))
            .andExpect(jsonPath("$.[*].quantitySmsYear").value(hasItem(DEFAULT_QUANTITY_SMS_YEAR.intValue())))
            .andExpect(jsonPath("$.[*].quantitySmsWeek").value(hasItem(DEFAULT_QUANTITY_SMS_WEEK.intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getDataPackage() throws Exception {
        // Initialize the database
        dataPackageRepository.saveAndFlush(dataPackage);

        // Get the dataPackage
        restDataPackageMockMvc
            .perform(get(ENTITY_API_URL_ID, dataPackage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dataPackage.getId().intValue()))
            .andExpect(jsonPath("$.createdTime").value(DEFAULT_CREATED_TIME.toString()))
            .andExpect(jsonPath("$.createdName").value(DEFAULT_CREATED_NAME))
            .andExpect(jsonPath("$.updateTime").value(DEFAULT_UPDATE_TIME.toString()))
            .andExpect(jsonPath("$.updateName").value(DEFAULT_UPDATE_NAME))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.levelSchool").value(DEFAULT_LEVEL_SCHOOL))
            .andExpect(jsonPath("$.prices").value(sameNumber(DEFAULT_PRICES)))
            .andExpect(jsonPath("$.quantitySmsYear").value(DEFAULT_QUANTITY_SMS_YEAR.intValue()))
            .andExpect(jsonPath("$.quantitySmsWeek").value(DEFAULT_QUANTITY_SMS_WEEK.intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingDataPackage() throws Exception {
        // Get the dataPackage
        restDataPackageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDataPackage() throws Exception {
        // Initialize the database
        dataPackageRepository.saveAndFlush(dataPackage);

        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();

        // Update the dataPackage
        DataPackage updatedDataPackage = dataPackageRepository.findById(dataPackage.getId()).get();
        // Disconnect from session so that the updates on updatedDataPackage are not directly saved in db
        em.detach(updatedDataPackage);
        updatedDataPackage
            .createdTime(UPDATED_CREATED_TIME)
            .createdName(UPDATED_CREATED_NAME)
            .updateTime(UPDATED_UPDATE_TIME)
            .updateName(UPDATED_UPDATE_NAME)
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .levelSchool(UPDATED_LEVEL_SCHOOL)
//            .prices(UPDATED_PRICES)
//            .quantitySmsYear(UPDATED_QUANTITY_SMS_YEAR)
//            .quantitySmsWeek(UPDATED_QUANTITY_SMS_WEEK)
            .description(UPDATED_DESCRIPTION);
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(updatedDataPackage);

        restDataPackageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dataPackageDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isOk());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
        DataPackage testDataPackage = dataPackageList.get(dataPackageList.size() - 1);
        assertThat(testDataPackage.getCreatedTime()).isEqualTo(UPDATED_CREATED_TIME);
        assertThat(testDataPackage.getCreatedName()).isEqualTo(UPDATED_CREATED_NAME);
        assertThat(testDataPackage.getUpdateTime()).isEqualTo(UPDATED_UPDATE_TIME);
        assertThat(testDataPackage.getUpdateName()).isEqualTo(UPDATED_UPDATE_NAME);
        assertThat(testDataPackage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataPackage.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testDataPackage.getLevelSchool()).isEqualTo(UPDATED_LEVEL_SCHOOL);
//        assertThat(testDataPackage.getPrices()).isEqualTo(UPDATED_PRICES);
//        assertThat(testDataPackage.getQuantitySmsYear()).isEqualTo(UPDATED_QUANTITY_SMS_YEAR);
//        assertThat(testDataPackage.getQuantitySmsWeek()).isEqualTo(UPDATED_QUANTITY_SMS_WEEK);
        assertThat(testDataPackage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingDataPackage() throws Exception {
        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();
        dataPackage.setId(count.incrementAndGet());

        // Create the DataPackage
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDataPackageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dataPackageDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDataPackage() throws Exception {
        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();
        dataPackage.setId(count.incrementAndGet());

        // Create the DataPackage
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataPackageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDataPackage() throws Exception {
        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();
        dataPackage.setId(count.incrementAndGet());

        // Create the DataPackage
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataPackageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataPackageDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDataPackageWithPatch() throws Exception {
        // Initialize the database
        dataPackageRepository.saveAndFlush(dataPackage);

        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();

        // Update the dataPackage using partial update
        DataPackage partialUpdatedDataPackage = new DataPackage();
        partialUpdatedDataPackage.setId(dataPackage.getId());

        partialUpdatedDataPackage
            .createdTime(UPDATED_CREATED_TIME)
            .updateTime(UPDATED_UPDATE_TIME)
            .updateName(UPDATED_UPDATE_NAME)
            .levelSchool(UPDATED_LEVEL_SCHOOL)
//            .quantitySmsWeek(UPDATED_QUANTITY_SMS_WEEK)
        ;

        restDataPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataPackage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDataPackage))
            )
            .andExpect(status().isOk());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
        DataPackage testDataPackage = dataPackageList.get(dataPackageList.size() - 1);
        assertThat(testDataPackage.getCreatedTime()).isEqualTo(UPDATED_CREATED_TIME);
        assertThat(testDataPackage.getCreatedName()).isEqualTo(DEFAULT_CREATED_NAME);
        assertThat(testDataPackage.getUpdateTime()).isEqualTo(UPDATED_UPDATE_TIME);
        assertThat(testDataPackage.getUpdateName()).isEqualTo(UPDATED_UPDATE_NAME);
        assertThat(testDataPackage.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDataPackage.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testDataPackage.getLevelSchool()).isEqualTo(UPDATED_LEVEL_SCHOOL);
//        assertThat(testDataPackage.getPrices()).isEqualByComparingTo(DEFAULT_PRICES);
//        assertThat(testDataPackage.getQuantitySmsYear()).isEqualTo(DEFAULT_QUANTITY_SMS_YEAR);
//        assertThat(testDataPackage.getQuantitySmsWeek()).isEqualTo(UPDATED_QUANTITY_SMS_WEEK);
        assertThat(testDataPackage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateDataPackageWithPatch() throws Exception {
        // Initialize the database
        dataPackageRepository.saveAndFlush(dataPackage);

        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();

        // Update the dataPackage using partial update
        DataPackage partialUpdatedDataPackage = new DataPackage();
        partialUpdatedDataPackage.setId(dataPackage.getId());

        partialUpdatedDataPackage
            .createdTime(UPDATED_CREATED_TIME)
            .createdName(UPDATED_CREATED_NAME)
            .updateTime(UPDATED_UPDATE_TIME)
            .updateName(UPDATED_UPDATE_NAME)
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .levelSchool(UPDATED_LEVEL_SCHOOL)
//            .prices(UPDATED_PRICES)
//            .quantitySmsYear(UPDATED_QUANTITY_SMS_YEAR)
//            .quantitySmsWeek(UPDATED_QUANTITY_SMS_WEEK)
            .description(UPDATED_DESCRIPTION);

        restDataPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataPackage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDataPackage))
            )
            .andExpect(status().isOk());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
        DataPackage testDataPackage = dataPackageList.get(dataPackageList.size() - 1);
        assertThat(testDataPackage.getCreatedTime()).isEqualTo(UPDATED_CREATED_TIME);
        assertThat(testDataPackage.getCreatedName()).isEqualTo(UPDATED_CREATED_NAME);
        assertThat(testDataPackage.getUpdateTime()).isEqualTo(UPDATED_UPDATE_TIME);
        assertThat(testDataPackage.getUpdateName()).isEqualTo(UPDATED_UPDATE_NAME);
        assertThat(testDataPackage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataPackage.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testDataPackage.getLevelSchool()).isEqualTo(UPDATED_LEVEL_SCHOOL);
//        assertThat(testDataPackage.getPrices()).isEqualByComparingTo(UPDATED_PRICES);
//        assertThat(testDataPackage.getQuantitySmsYear()).isEqualTo(UPDATED_QUANTITY_SMS_YEAR);
//        assertThat(testDataPackage.getQuantitySmsWeek()).isEqualTo(UPDATED_QUANTITY_SMS_WEEK);
        assertThat(testDataPackage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingDataPackage() throws Exception {
        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();
        dataPackage.setId(count.incrementAndGet());

        // Create the DataPackage
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDataPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dataPackageDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDataPackage() throws Exception {
        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();
        dataPackage.setId(count.incrementAndGet());

        // Create the DataPackage
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataPackageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDataPackage() throws Exception {
        int databaseSizeBeforeUpdate = dataPackageRepository.findAll().size();
        dataPackage.setId(count.incrementAndGet());

        // Create the DataPackage
        DataPackageDTO dataPackageDTO = dataPackageMapper.toDto(dataPackage);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataPackageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dataPackageDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DataPackage in the database
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDataPackage() throws Exception {
        // Initialize the database
        dataPackageRepository.saveAndFlush(dataPackage);

        int databaseSizeBeforeDelete = dataPackageRepository.findAll().size();

        // Delete the dataPackage
        restDataPackageMockMvc
            .perform(delete(ENTITY_API_URL_ID, dataPackage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DataPackage> dataPackageList = dataPackageRepository.findAll();
        assertThat(dataPackageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
