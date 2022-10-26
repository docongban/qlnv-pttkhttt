package com.laos.edu.web.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.laos.edu.service.DashBoardService;
import com.laos.edu.service.DataPackageService;
import com.laos.edu.service.ProvinceService;
import com.laos.edu.service.dto.DashBoardDTO;
import com.laos.edu.service.dto.DataPackageDTO;
import com.laos.edu.service.dto.ProvinceDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/dashBoard")
public class DashBoardResources {

    private final Logger log = LoggerFactory.getLogger(DataPackageResource.class);
    private static final String urlSchool= "http://localhost:8080/api/province";
    private final DashBoardService dashBoardService;

    private final ProvinceService provinceService;
    private final DataPackageService dataPackageService;
    public DashBoardResources(DashBoardService dashBoardService, ProvinceService provinceService, DataPackageService dataPackageService){
        this.dashBoardService = dashBoardService;
        this.provinceService = provinceService;
        this.dataPackageService = dataPackageService;
    }

    @PostMapping("/getInfoForStatistic")
    public ResponseEntity<?> getInfoForStatistic(Pageable pageable, @RequestBody DashBoardDTO dashBoardDTO) throws JsonProcessingException {
        List<ProvinceDTO> listProvince = provinceService.getSchoolAndGroupByProvince();
        DashBoardDTO returnValue  = dashBoardService.getInfoForStatisticOnDashBoard(dashBoardDTO);
        Page<DataPackageDTO> listDataPackage = dataPackageService.findAll(pageable);
        returnValue.setProvinces(listProvince);
        returnValue.setDataPackages(listDataPackage);
        return ResponseEntity.ok(returnValue);
    }
}
