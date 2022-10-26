package com.laos.edu.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.laos.edu.web.rest.TestUtil;

public class JhiUserDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(JhiUserDTO.class);
        JhiUserDTO jhiUserDTO1 = new JhiUserDTO();
        jhiUserDTO1.setId(1L);
        JhiUserDTO jhiUserDTO2 = new JhiUserDTO();
        assertThat(jhiUserDTO1).isNotEqualTo(jhiUserDTO2);
        jhiUserDTO2.setId(jhiUserDTO1.getId());
        assertThat(jhiUserDTO1).isEqualTo(jhiUserDTO2);
        jhiUserDTO2.setId(2L);
        assertThat(jhiUserDTO1).isNotEqualTo(jhiUserDTO2);
        jhiUserDTO1.setId(null);
        assertThat(jhiUserDTO1).isNotEqualTo(jhiUserDTO2);
    }
}
