package com.laos.edu.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class RegisterPackageMapperTest {

    private RegisterPackageMapper registerPackageMapper;

    @BeforeEach
    public void setUp() {
        registerPackageMapper = new RegisterPackageMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
//        assertThat(registerPackageMapper.fromId(id).getId()).isEqualTo(id);
//        assertThat(registerPackageMapper.fromId(null)).isNull();
    }
}
