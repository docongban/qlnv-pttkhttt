package com.laos.edu.service.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.repository.DashBoardRepository;
import com.laos.edu.repository.RegisterPackageRepository;
import com.laos.edu.service.DashBoardService;
import com.laos.edu.service.dto.DashBoardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashBoardServiceImpl implements DashBoardService {
    @Autowired
    private RegisterPackageRepository registerPackageRepository;

    private DashBoardRepository dashBoardRepository;
//    private final int midMonth = 15;
    public DashBoardServiceImpl(DashBoardRepository dashBoardRepository){
        this.dashBoardRepository = dashBoardRepository;
    }

    @Override
    public DashBoardDTO getInfoForStatisticOnDashBoard(DashBoardDTO dashBoardDTO) {
        DashBoardDTO returnValue =  dashBoardRepository.numberOfSchoolIsActiveAndNumberOfDataPackage(dashBoardDTO);

        String fromDateCurrentStr  = dashBoardDTO.getMonthForStatistic()+"-01";
        LocalDate toDateCurrent = LocalDate.parse(fromDateCurrentStr);
        LocalDate toDateBegin = toDateCurrent.minusMonths(1);

        // Get Last day of month
        toDateCurrent = toDateCurrent.withDayOfMonth(toDateCurrent.getMonth().length(toDateCurrent.isLeapYear()));
        toDateBegin = toDateBegin.withDayOfMonth(toDateBegin.getMonth().length(toDateBegin.isLeapYear()));
        String toDateCurrentStr = toDateCurrent.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String toDateBeginStr = toDateBegin.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        List<Map<String, Object>> registerReportDTOS = registerPackageRepository.loadChart(
            toDateBeginStr,
            fromDateCurrentStr,
            toDateCurrentStr
        ).parallelStream()
            .map(
                o->{
                    Map<String, Object> m = new HashMap<>();
                    m.put("code", o[0]);
                    m.put("name", o[1]);
                    m.put("countPeople", o[2]);
                    m.put("revenue", o[3]);
                    return m;
                }
            ).collect(Collectors.toList());

        registerPackageRepository.getCountUserAndRevenue(toDateBeginStr, fromDateCurrentStr, toDateCurrentStr)
            .stream().distinct().forEach(
                o ->{
                    returnValue.setNumberOfUser(DataUtil.safeToLong(o[0]));
                    returnValue.setUserGrowthRate(o[1]);
                    returnValue.setRevenue(DataUtil.safeToString(o[2]));
                    returnValue.setRevenueGrowthRate(o[3]);
                }
            );

        returnValue.setChartList(registerReportDTOS);

        return returnValue ;
    }
}
