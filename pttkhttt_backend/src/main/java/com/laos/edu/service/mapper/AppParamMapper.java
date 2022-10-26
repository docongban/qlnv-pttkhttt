package com.laos.edu.service.mapper;

import com.laos.edu.domain.AppParam;
import com.laos.edu.service.dto.AppParamDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link AppParam} and its DTO {@link AppParamDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AppParamMapper extends EntityMapper<AppParamDTO, AppParam> {}
