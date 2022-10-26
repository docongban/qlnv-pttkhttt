package com.laos.edu.service.mapper;

import com.laos.edu.domain.*;
import com.laos.edu.service.dto.DataPackageDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DataPackage} and its DTO {@link DataPackageDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DataPackageMapper extends EntityMapper<DataPackageDTO, DataPackage> {}
