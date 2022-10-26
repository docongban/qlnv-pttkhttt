package com.laos.edu.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.laos.edu.web.rest.TestUtil;

public class RegisterPackageDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(RegisterPackageDTO.class);
        RegisterPackageDTO registerPackageDTO1 = new RegisterPackageDTO();
        registerPackageDTO1.setId(1L);
        RegisterPackageDTO registerPackageDTO2 = new RegisterPackageDTO();
        assertThat(registerPackageDTO1).isNotEqualTo(registerPackageDTO2);
        registerPackageDTO2.setId(registerPackageDTO1.getId());
        assertThat(registerPackageDTO1).isEqualTo(registerPackageDTO2);
        registerPackageDTO2.setId(2L);
        assertThat(registerPackageDTO1).isNotEqualTo(registerPackageDTO2);
        registerPackageDTO1.setId(null);
        assertThat(registerPackageDTO1).isNotEqualTo(registerPackageDTO2);
    }
}
