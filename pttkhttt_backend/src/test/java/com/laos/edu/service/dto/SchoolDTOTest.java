package com.laos.edu.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.laos.edu.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SchoolDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SchoolDTO.class);
        SchoolDTO schoolDTO1 = new SchoolDTO();
        schoolDTO1.setId(1L);
        SchoolDTO schoolDTO2 = new SchoolDTO();
        assertThat(schoolDTO1).isNotEqualTo(schoolDTO2);
        schoolDTO2.setId(schoolDTO1.getId());
        assertThat(schoolDTO1).isEqualTo(schoolDTO2);
        schoolDTO2.setId(2L);
        assertThat(schoolDTO1).isNotEqualTo(schoolDTO2);
        schoolDTO1.setId(null);
        assertThat(schoolDTO1).isNotEqualTo(schoolDTO2);
    }
}
