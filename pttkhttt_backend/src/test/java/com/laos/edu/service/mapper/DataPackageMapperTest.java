package com.laos.edu.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DataPackageMapperTest {

    private DataPackageMapper dataPackageMapper;

    @BeforeEach
    public void setUp() {
        dataPackageMapper = new DataPackageMapperImpl();
    }
}
