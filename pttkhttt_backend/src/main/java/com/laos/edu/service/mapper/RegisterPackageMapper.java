package com.laos.edu.service.mapper;


import com.laos.edu.domain.*;
import com.laos.edu.service.dto.RegisterPackageDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link RegisterPackage} and its DTO {@link RegisterPackageDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface RegisterPackageMapper extends EntityMapper<RegisterPackageDTO, RegisterPackage> {

}
