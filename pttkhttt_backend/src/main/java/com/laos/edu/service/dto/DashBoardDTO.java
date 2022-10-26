package com.laos.edu.service.dto;

import com.laos.edu.domain.DataPackage;
import com.laos.edu.domain.Province;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashBoardDTO {

    // Tháng thống kê
    private String monthForStatistic;

    // Số lượng trường học trên hệ thống đang active(Số trường học cuối kì)
    private Long numberOfSchoolOnSystemAndIsActive;

    //
    private Long numberOfSchoolBeginSemesterOnSystemAndIsActive;
    // Số lượng gói cước
    private Long numberOfDataPackageApply;

    // Số lượng người dùng hệ thống
    private Long numberOfUser;

    // Doanh thu
    private String revenue;

    // Tỉ lệ Tăng trưởng trường học
    private String schoolGrowthRate;

    // Tỉ lệ Tăng trưởng user
    private Object userGrowthRate;

    // Tỉ lệ Tăng trưởng doanh thu
    private Object revenueGrowthRate;


    private List<ProvinceDTO> provinces;

    private Page<DataPackageDTO> dataPackages;

    private List<?> chartList;
}
