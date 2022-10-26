package com.laos.edu.repository;

import com.laos.edu.service.dto.DataPackageDTO;
import java.math.BigInteger;
import java.util.List;


public interface DataPackageCustomRepository {
    List<DataPackageDTO> searchDataPackages(DataPackageDTO dataPackageDTO, Integer page, Integer pageSize);
    BigInteger getTotalRecords(DataPackageDTO dataPackageDTO);
    DataPackageDTO findByLevelSchool(DataPackageDTO dataPackageDTO,String levelSchool);
    DataPackageDTO findByService(DataPackageDTO dataPackageDTO,String levelSchool);
    void savePackagePrice(DataPackageDTO dataPackageDTO);

    boolean checkDependency(DataPackageDTO dataPackageDTO);

    boolean checkAlreadyAssignForSchool(DataPackageDTO dataPackageDTO);

    //boolean checkAlreadyAssignForSchoolUpdate(DataPackageDTO dataPackageDTO);

    boolean checkSupportPackageHavePrimaryPackageAssignedBySchool(DataPackageDTO dataPackageDTO);

    boolean checkSupportPackageIsAssignedByPrimaryPackage(DataPackageDTO dataPackageDTO);

    List<DataPackageDTO> findPrimaryPackageBySupportPackage(DataPackageDTO dataPackageDTO);

    List<DataPackageDTO> getAllByLevelSchool(String levelSchool);
}
