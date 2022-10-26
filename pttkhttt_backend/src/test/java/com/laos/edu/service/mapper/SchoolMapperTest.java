package com.laos.edu.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SchoolMapperTest {

    private SchoolMapper schoolMapper;

    @BeforeEach
    public void setUp() {
        schoolMapper = new SchoolMapperImpl();
    }
}
