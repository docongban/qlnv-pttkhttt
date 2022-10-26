package com.laos.edu.web.rest;

import com.laos.edu.domain.ReportSendMessage;
import com.laos.edu.service.ReportSendMessageService;
import com.laos.edu.service.dto.RegisterDTO;
import com.laos.edu.service.dto.ReportSendMessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/school-api/api")
public class ReportSendMessageApiResource {

    private final Logger log = LoggerFactory.getLogger(ReportSendMessageApiResource.class);

    @Autowired
    private ReportSendMessageService reportSendMessageService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @PostMapping(value = "/reportSendMessage/add")
    public ResponseEntity<?> addReportSendMessage(@RequestBody ReportSendMessageDTO reportSendMessageDTO) throws URISyntaxException {
        log.debug("REST request to save ReportSendMessage : {}", reportSendMessageDTO);
        return ResponseEntity.ok().body(reportSendMessageService.save(reportSendMessageDTO.getReportSendMessageList()));
    }
}
