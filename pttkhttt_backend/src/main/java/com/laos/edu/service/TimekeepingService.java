package com.laos.edu.service;

import com.laos.edu.domain.Timekeeping;
import com.laos.edu.service.dto.ServiceResult;
import com.laos.edu.service.dto.TimekeepingDTO;
import com.laos.edu.service.dto.TimekeepingExportDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TimekeepingService {

    Page<TimekeepingDTO> doSearch(TimekeepingDTO timekeepingDTO, int page, int pageSize);

    ServiceResult createTimekeeping(Timekeeping timekeeping);

    ServiceResult updateTimekeeping(Timekeeping timekeeping);

    ServiceResult deleteTimekeeping(Timekeeping timekeeping);

    List<TimekeepingExportDTO> exort(TimekeepingDTO timekeepingDTO);
}
