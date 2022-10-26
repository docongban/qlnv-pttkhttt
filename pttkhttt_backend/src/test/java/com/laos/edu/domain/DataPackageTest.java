package com.laos.edu.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.laos.edu.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DataPackageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataPackage.class);
        DataPackage dataPackage1 = new DataPackage();
        dataPackage1.setId(1L);
        DataPackage dataPackage2 = new DataPackage();
        dataPackage2.setId(dataPackage1.getId());
        assertThat(dataPackage1).isEqualTo(dataPackage2);
        dataPackage2.setId(2L);
        assertThat(dataPackage1).isNotEqualTo(dataPackage2);
        dataPackage1.setId(null);
        assertThat(dataPackage1).isNotEqualTo(dataPackage2);
    }
}
