package com.laos.edu.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.laos.edu.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DataPackageDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataPackageDTO.class);
        DataPackageDTO dataPackageDTO1 = new DataPackageDTO();
        dataPackageDTO1.setId(1L);
        DataPackageDTO dataPackageDTO2 = new DataPackageDTO();
        assertThat(dataPackageDTO1).isNotEqualTo(dataPackageDTO2);
        dataPackageDTO2.setId(dataPackageDTO1.getId());
        assertThat(dataPackageDTO1).isEqualTo(dataPackageDTO2);
        dataPackageDTO2.setId(2L);
        assertThat(dataPackageDTO1).isNotEqualTo(dataPackageDTO2);
        dataPackageDTO1.setId(null);
        assertThat(dataPackageDTO1).isNotEqualTo(dataPackageDTO2);
    }
}
