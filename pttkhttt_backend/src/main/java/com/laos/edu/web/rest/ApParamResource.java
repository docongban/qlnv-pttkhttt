package com.laos.edu.web.rest;

import com.laos.edu.domain.AppParam;
import com.laos.edu.repository.AppParamRepository;
import com.laos.edu.service.ApParamService;
import com.laos.edu.service.DataPackageService;
import com.laos.edu.service.dto.AppParamDTO;
import com.laos.edu.service.dto.ServiceResult;
import org.apache.xmlbeans.impl.xb.xsdschema.Public;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApParamResource {

    @Autowired
    private ApParamService apParamService;

    @Autowired
    private AppParamRepository appParamRepository;

    @Autowired
    private DataPackageService dataPackageService;

    @GetMapping(path = "/ap-param", params = "parentCode")
    public ResponseEntity findByParentCode(@RequestParam String parentCode) {
        ServiceResult result = this.apParamService.findByParentCode(parentCode);
        return ResponseEntity.ok(result);
    }

    @GetMapping(path = "/ap-param", params = "type")
    public ResponseEntity findBtType(@RequestParam String type) {
        List<AppParam> result = this.apParamService.findByType(type);
        return ResponseEntity.ok(result);
    }

    @GetMapping(path = "/ap-param/{id}")
    public ResponseEntity findById(@PathVariable Long id){
        AppParam appParam = appParamRepository.findById(id).get();
        return ResponseEntity.ok(appParam);
    }

    @GetMapping(path = "/ap-param/get-by-type")
    public ResponseEntity<?> findByTypeOrderByValue(@RequestParam("type") String type){
        List<AppParam> list = appParamRepository.getAllByTypeOrderByValueAsc(type);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(path="/ap-param/data-packages-service")
    public ResponseEntity<?> findAllByTypeDataPackagesService(@RequestParam(name = "lang") String lang){
        List<AppParam> list = appParamRepository.getAllByTypeDataPackageService("data_packages_service");
        list = list.stream().peek(i -> {
            if("vn".equals(lang)){
                i.setName(i.getName());
            }else if("en".equals(lang)){
                i.setName(i.getNameEN());
            }else{
                i.setName(i.getNameLA());
            }
        }).collect(Collectors.toList());
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/ap-param/data-package/find")
    public ResponseEntity<List<AppParamDTO>> getByPrimaryPackage(@RequestParam String primaryPackageCode) {
        return ResponseEntity.ok().body(dataPackageService.findByPrimaryPackageCode(primaryPackageCode));
    }
}
