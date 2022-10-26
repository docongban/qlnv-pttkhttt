package com.laos.edu.service;

import com.laos.edu.service.dto.DashBoardDTO;
import org.springframework.stereotype.Service;

public interface DashBoardService {
     DashBoardDTO getInfoForStatisticOnDashBoard(DashBoardDTO dashBoardDTO);
}
