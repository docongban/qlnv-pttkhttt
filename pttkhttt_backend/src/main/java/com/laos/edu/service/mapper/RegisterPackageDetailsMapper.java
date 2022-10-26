package com.laos.edu.service.mapper;


import com.laos.edu.domain.RegisterPackage;
import com.laos.edu.domain.RegisterPackageDetails;
import com.laos.edu.service.dto.RegisterPackageDTO;
import com.laos.edu.service.dto.RegisterPackageDetailsDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link RegisterPackage} and its DTO {@link RegisterPackageDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface RegisterPackageDetailsMapper extends EntityMapper<RegisterPackageDetailsDTO, RegisterPackageDetails> {

//    default RegisterPackage fromId(Long id) {
//        if (id == null) {
//            return null;
//        }
//        RegisterPackage registerPackage = new RegisterPackage();
//        registerPackage.setId(id);
//        return registerPackage;
//    }
}
