package com.laos.edu.web.rest;

import com.laos.edu.LaoseduApp;
import com.laos.edu.domain.Province;
import com.laos.edu.repository.ProvinceRepository;
import com.laos.edu.service.ProvinceService;
import com.laos.edu.service.dto.ProvinceDTO;
import com.laos.edu.service.mapper.ProvinceMapper;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProvinceResource} REST controller.
 */
@SpringBootTest(classes = LaoseduApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ProvinceResourceIT {

    private static final String DEFAULT_PR_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PR_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PR_NAME_EN = "AAAAAAAAAA";
    private static final String UPDATED_PR_NAME_EN = "BBBBBBBBBB";

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private ProvinceMapper provinceMapper;

    @Autowired
    private ProvinceService provinceService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProvinceMockMvc;

    private Province province;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Province createEntity(EntityManager em) {
        Province province = new Province()
            .prName(DEFAULT_PR_NAME)
            .prNameEn(DEFAULT_PR_NAME_EN);
        return province;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Province createUpdatedEntity(EntityManager em) {
        Province province = new Province()
            .prName(UPDATED_PR_NAME)
            .prNameEn(UPDATED_PR_NAME_EN);
        return province;
    }

    @BeforeEach
    public void initTest() {
        province = createEntity(em);
    }

    @Test
    @Transactional
    public void createProvince() throws Exception {
        int databaseSizeBeforeCreate = provinceRepository.findAll().size();
        // Create the Province
        ProvinceDTO provinceDTO = provinceMapper.toDto(province);
        restProvinceMockMvc.perform(post("/api/provinces")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(provinceDTO)))
            .andExpect(status().isCreated());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeCreate + 1);
        Province testProvince = provinceList.get(provinceList.size() - 1);
        assertThat(testProvince.getPrName()).isEqualTo(DEFAULT_PR_NAME);
        assertThat(testProvince.getPrNameEn()).isEqualTo(DEFAULT_PR_NAME_EN);
    }

    @Test
    @Transactional
    public void createProvinceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = provinceRepository.findAll().size();

        // Create the Province with an existing ID
        province.setId(1L);
        ProvinceDTO provinceDTO = provinceMapper.toDto(province);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProvinceMockMvc.perform(post("/api/provinces")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(provinceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllProvinces() throws Exception {
        // Initialize the database
        provinceRepository.saveAndFlush(province);

        // Get all the provinceList
        restProvinceMockMvc.perform(get("/api/provinces?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(province.getId().intValue())))
            .andExpect(jsonPath("$.[*].prName").value(hasItem(DEFAULT_PR_NAME)))
            .andExpect(jsonPath("$.[*].prNameEn").value(hasItem(DEFAULT_PR_NAME_EN)));
    }
    
    @Test
    @Transactional
    public void getProvince() throws Exception {
        // Initialize the database
        provinceRepository.saveAndFlush(province);

        // Get the province
        restProvinceMockMvc.perform(get("/api/provinces/{id}", province.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(province.getId().intValue()))
            .andExpect(jsonPath("$.prName").value(DEFAULT_PR_NAME))
            .andExpect(jsonPath("$.prNameEn").value(DEFAULT_PR_NAME_EN));
    }
    @Test
    @Transactional
    public void getNonExistingProvince() throws Exception {
        // Get the province
        restProvinceMockMvc.perform(get("/api/provinces/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProvince() throws Exception {
        // Initialize the database
        provinceRepository.saveAndFlush(province);

        int databaseSizeBeforeUpdate = provinceRepository.findAll().size();

        // Update the province
        Province updatedProvince = provinceRepository.findById(province.getId()).get();
        // Disconnect from session so that the updates on updatedProvince are not directly saved in db
        em.detach(updatedProvince);
        updatedProvince
            .prName(UPDATED_PR_NAME)
            .prNameEn(UPDATED_PR_NAME_EN);
        ProvinceDTO provinceDTO = provinceMapper.toDto(updatedProvince);

        restProvinceMockMvc.perform(put("/api/provinces")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(provinceDTO)))
            .andExpect(status().isOk());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeUpdate);
        Province testProvince = provinceList.get(provinceList.size() - 1);
        assertThat(testProvince.getPrName()).isEqualTo(UPDATED_PR_NAME);
        assertThat(testProvince.getPrNameEn()).isEqualTo(UPDATED_PR_NAME_EN);
    }

    @Test
    @Transactional
    public void updateNonExistingProvince() throws Exception {
        int databaseSizeBeforeUpdate = provinceRepository.findAll().size();

        // Create the Province
        ProvinceDTO provinceDTO = provinceMapper.toDto(province);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProvinceMockMvc.perform(put("/api/provinces")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(provinceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Province in the database
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProvince() throws Exception {
        // Initialize the database
        provinceRepository.saveAndFlush(province);

        int databaseSizeBeforeDelete = provinceRepository.findAll().size();

        // Delete the province
        restProvinceMockMvc.perform(delete("/api/provinces/{id}", province.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Province> provinceList = provinceRepository.findAll();
        assertThat(provinceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
