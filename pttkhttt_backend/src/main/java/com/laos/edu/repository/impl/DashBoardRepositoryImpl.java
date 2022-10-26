package com.laos.edu.repository.impl;

import com.laos.edu.repository.DashBoardRepository;
import com.laos.edu.service.dto.DashBoardDTO;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Repository
public class DashBoardRepositoryImpl implements DashBoardRepository {

    private final EntityManager entityManager;

    public DashBoardRepositoryImpl(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Override
    public DashBoardDTO numberOfSchoolIsActiveAndNumberOfDataPackage(DashBoardDTO dashBoardDTO) {
        StringBuilder sql = new StringBuilder();
        String[] yearAndMonth = convertDateToYearMonth(dashBoardDTO.getMonthForStatistic());
        int yearStatistic = Integer.parseInt(yearAndMonth[0]);
        int monthStatistic = Integer.parseInt(yearAndMonth[1]);
        int monthStatisticBefore;
        String theLastMonthYear;
        LocalDate now = LocalDate.now();

        String monthYearStatisticString  = dashBoardDTO.getMonthForStatistic()+"-01";
        LocalDate lastDayOfMonthLocalDate = LocalDate.parse(monthYearStatisticString);

        // Get Last day of month
        lastDayOfMonthLocalDate = lastDayOfMonthLocalDate
            .withDayOfMonth(lastDayOfMonthLocalDate
                .getMonth()
                .length(lastDayOfMonthLocalDate
                    .isLeapYear()
                )
            );

        int lastDayOfMonthStatistic = Integer.parseInt(lastDayOfMonthLocalDate.toString().substring(8,10));
        int monthNow = now.getMonthValue();
        int yearNow = now.getYear();
        int dayNow = now.getDayOfMonth();
        String startDateOfMonthStatistic = combineDate(dashBoardDTO);

        sql.append("SELECT  (" +
            " SELECT COUNT(*) " +
            " FROM data_packages " +
            " ) AS numberOfDataPackageApply," +
            " (" +
            " SELECT COUNT(*) " +
            " FROM schools as sc" +
            " WHERE sc.status = 1 " +
            " AND DATE(sc.created_time) >= :startDateOfMonthStatistic ");
        if(monthNow == monthStatistic && yearNow == yearStatistic){
            if(dayNow < lastDayOfMonthStatistic){
                sql.append(" AND DATE(sc.created_time) <= :monthYearStatistic" +
                    " ) AS numberOfSchoolOnSystemAndIsActive, ");
            }else{
                sql.append(" AND DATE(sc.created_time) <= LAST_DAY(:monthYearStatistic)" +
                    " ) AS numberOfSchoolOnSystemAndIsActive, ");
            }
        }else{
            sql.append(" AND DATE(sc.created_time) <= LAST_DAY(:monthYearStatistic)" +
                " ) AS numberOfSchoolOnSystemAndIsActive, ");
        }

        // Count số lượng trường đầu kì:
        if(monthStatistic == 1){
            yearStatistic = yearStatistic - 1;
            monthStatisticBefore = 12;

        }else{
            monthStatisticBefore = monthStatistic - 1;
        }
        theLastMonthYear = yearStatistic+"-"+monthStatisticBefore;
        sql.append("(" +
            " SELECT COUNT(*) " +
            " FROM schools as sc " +
            " WHERE sc.status = 1 " +
            " AND DATE(sc.created_time) <=  LAST_DAY(:theLastMonthYear) " +
            ") AS numberOfSchoolBeginSemesterOnSystemAndIsActive");

        sql.append(" FROM  DUAL ");
        Query query  = entityManager.createNativeQuery(sql.toString());
        query.setParameter("startDateOfMonthStatistic", startDateOfMonthStatistic);
        if(monthNow == monthStatistic && yearNow == yearStatistic){
            if(dayNow < lastDayOfMonthStatistic && dayNow >= 10){
                query.setParameter("monthYearStatistic",dashBoardDTO.getMonthForStatistic()+"-"+dayNow);

            }else if(dayNow < 10){
                    query.setParameter("monthYearStatistic",dashBoardDTO.getMonthForStatistic()+"-0"+dayNow);
            }else{
                query.setParameter("monthYearStatistic",dashBoardDTO.getMonthForStatistic()+"-00");
            }
        }else{
            query.setParameter("monthYearStatistic",dashBoardDTO.getMonthForStatistic()+"-00");
        }

        query.setParameter("theLastMonthYear", theLastMonthYear+"-00");

        query.unwrap(SQLQuery.class)
            .addScalar("numberOfDataPackageApply", new LongType())
            .addScalar("numberOfSchoolOnSystemAndIsActive", new LongType())
            .addScalar("numberOfSchoolBeginSemesterOnSystemAndIsActive", new LongType())
            .setResultTransformer(Transformers.aliasToBean(DashBoardDTO.class));

        DashBoardDTO result = (DashBoardDTO) query.getSingleResult();
        float startSemester = Float.parseFloat(result.getNumberOfSchoolBeginSemesterOnSystemAndIsActive().toString());
        float endSemester = Float.parseFloat(result.getNumberOfSchoolOnSystemAndIsActive().toString());
        if(startSemester == 0){
            result.setSchoolGrowthRate(null);
        }else{
            Float returnValue = null;
            returnValue = ((endSemester/startSemester) - 1)*100;
            DecimalFormat formatValue = new DecimalFormat("##.##");
            result.setSchoolGrowthRate(formatValue.format(returnValue));
        }

        return result;
    }

    private String[] convertDateToYearMonth(String monthForStatistic){
        String[] yearAndMonth = null;
        if(monthForStatistic.contains("-")){
            yearAndMonth = monthForStatistic.split("-");
        }
        return yearAndMonth;
    }

    private String combineDate(DashBoardDTO dashBoardDTO){
        String FIRST_DAY_OF_MONTH = "-01";
        return dashBoardDTO.getMonthForStatistic() +
            FIRST_DAY_OF_MONTH;
    }
}
