package com.laos.edu.repository;

import com.laos.edu.domain.Timekeeping;
import com.laos.edu.service.dto.TimekeepingDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TimekeepingRepositoryCustom {

    Page<TimekeepingDTO> doSearch(TimekeepingDTO timekeepingDTO, int page, int pageSize);

    List<TimekeepingDTO> searchAll(TimekeepingDTO timekeepingDTO);

    List<TimekeepingDTO> countTimekeeping(TimekeepingDTO timekeepingDTO);
}
