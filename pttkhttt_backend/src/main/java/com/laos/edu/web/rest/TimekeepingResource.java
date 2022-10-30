package com.laos.edu.web.rest;

import com.laos.edu.commons.ExportUtils;
import com.laos.edu.domain.Timekeeping;
import com.laos.edu.repository.EmployeeRepository;
import com.laos.edu.service.TimekeepingService;
import com.laos.edu.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/timekeeping")
public class TimekeepingResource {
    private final Logger log = LoggerFactory.getLogger(SchoolResource.class);

    private final ExportUtils exportUtils;

    private static String MEDIA_TYPE = "application/octet-stream";

    @Autowired
    TimekeepingService timekeepingService;

    @Autowired
    EmployeeRepository employeeRepository;

    public TimekeepingResource(ExportUtils exportUtils) {
        this.exportUtils = exportUtils;
    }

    @PostMapping("/search")
    public Page<TimekeepingDTO> handleSearch(
        @RequestBody TimekeepingDTO timekeepingDTO,
        @RequestParam(value = "page", defaultValue = "1") int page,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize
    ) throws URISyntaxException {
        return timekeepingService.doSearch(timekeepingDTO, page, pageSize);
    }

    @GetMapping("/getAllEmployee")
    public ResponseEntity<?> getAllEmployee(){
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    @PostMapping("/getById")
    public ResponseEntity<?> getById(@RequestBody TimekeepingDTO timekeepingDTO){
        TimekeepingDTO result = timekeepingService.getById(timekeepingDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create")
    public ResponseEntity<?> hanldeCreateTimekeeping(@RequestBody Timekeeping timekeeping){
        ServiceResult result = timekeepingService.createTimekeeping(timekeeping);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/update")
    public ResponseEntity<?> hanldeUpdateTimekeeping(@RequestBody Timekeeping timekeeping){
        ServiceResult result = timekeepingService.updateTimekeeping(timekeeping);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/delete")
    public ResponseEntity<?> hanldeDeleteTimekeeping(@RequestBody TimekeepingDTO timekeepingDTO){
        ServiceResult result = timekeepingService.deleteTimekeeping(timekeepingDTO);
        return ResponseEntity.ok(result);
    }

    //build column
    private List<ExcelColumn> buildColumnExport() {
        List<ExcelColumn> lstColumn = new ArrayList<>();

        lstColumn.add(new ExcelColumn("employeeCode", "Mã nhân viên", ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("employeeName", "Tên nhân viên", ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("employeeSex", "Giới tính", ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("employeePhoneNumber", "Số điện thoại", ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("employeeEmail", "Email", ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("employeeAddress", "Địa chỉ", ExcelColumn.ALIGN_MENT.LEFT));
        lstColumn.add(new ExcelColumn("timeAt", "Thời gian chấm công", ExcelColumn.ALIGN_MENT.LEFT));
        return lstColumn;
    }

    @PostMapping("/export")
    public ResponseEntity<?> handleExport(@RequestBody TimekeepingDTO timekeepingDTO) throws Exception {
        List<TimekeepingExportDTO> listData = timekeepingService.exort(timekeepingDTO);

        List<ExcelColumn> listColumn = buildColumnExport();
        String title = "BẢNG CHẤM CÔNG";
        String fileName = "BangChamCong" + "_ddmmyy";

        ExcelTitle excelTitle = new ExcelTitle(title, "", "");
        ByteArrayInputStream byteArrayInputStream = exportUtils.onExport(listColumn, listData, 2, 0, excelTitle, true);
        InputStreamResource resource = new InputStreamResource(byteArrayInputStream);

        return ResponseEntity
            .ok()
            .contentLength(byteArrayInputStream.available())
            .header("filename", fileName)
            .contentType(MediaType.parseMediaType(MEDIA_TYPE))
            .body(resource);
    }
}
