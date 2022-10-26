package com.laos.edu.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.laos.edu.web.rest.TestUtil;

public class RegisterPackageTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RegisterPackage.class);
        RegisterPackage registerPackage1 = new RegisterPackage();
        registerPackage1.setId(1L);
        RegisterPackage registerPackage2 = new RegisterPackage();
        registerPackage2.setId(registerPackage1.getId());
        assertThat(registerPackage1).isEqualTo(registerPackage2);
        registerPackage2.setId(2L);
        assertThat(registerPackage1).isNotEqualTo(registerPackage2);
        registerPackage1.setId(null);
        assertThat(registerPackage1).isNotEqualTo(registerPackage2);
    }
}
