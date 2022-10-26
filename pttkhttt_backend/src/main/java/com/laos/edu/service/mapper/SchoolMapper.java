package com.laos.edu.service.mapper;

import com.laos.edu.domain.*;
import com.laos.edu.service.dto.SchoolDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link School} and its DTO {@link SchoolDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SchoolMapper extends EntityMapper<SchoolDTO, School> {}
