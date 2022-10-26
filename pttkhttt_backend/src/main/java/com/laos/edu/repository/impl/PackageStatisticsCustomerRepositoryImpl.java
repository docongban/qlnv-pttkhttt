package com.laos.edu.repository.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.repository.PackageStatisticsCustomerRepository;
import com.laos.edu.service.dto.ContactResultDTO;
import com.laos.edu.service.dto.PackageStatisticsByMonthDTO;
import com.laos.edu.service.dto.PackageStatisticsDTO;
import com.laos.edu.service.dto.PackageStatisticsResultDTO;
import io.micrometer.core.instrument.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PackageStatisticsCustomerRepositoryImpl implements PackageStatisticsCustomerRepository {

    private final Logger log = LoggerFactory.getLogger(PackageStatisticsCustomerRepositoryImpl.class);

    @Autowired
    EntityManager entityManager;

    @Override
    public List<PackageStatisticsResultDTO> searchPackageStatistics(PackageStatisticsDTO packageStatisticsDTO, String language) {

        List<PackageStatisticsResultDTO> list = new ArrayList<>();

        StringBuilder sql = new StringBuilder("select bangtam3.schoolCode, bangtam3.schoolName, bangtam3.levelSchoolName, bangtam3.provinceName, " +
            " bangtam3.dataPackageCode, bangtam3.dataPackageName, " +
            " bangtam3.dataPackageCode as dataPackageCodeRegistered, ifnull(bangtam3.countRegister1PackageOf1School,0) as countRegister1PackageOf1School , " +
            " bangtam3.create_date, bangtam3.end_date, " +
            " ifnull(bangtam4.totalRegistration, 0) as totalRegistration , bangtam3.schoolId, " +
            " bangtam3.levelSchoolNameLa, bangtam3.levelSchoolNameEn " +
            " from " +
            " ( " +
            " select bangtam1.schoolId, bangtam1.schoolCode, bangtam1.schoolName, bangtam1.levelSchoolName, bangtam1.provinceName, " +
            " bangtam1.dataPackageCode, bangtam1.dataPackageName, " +
            " bangtam2.dataPackageCode as dataPackageCodeRegistered, bangtam2.countRegister1PackageOf1School, " +
            " bangtam2.create_date, bangtam2.end_date , " +
            " bangtam1.levelSchoolNameLa, bangtam1.levelSchoolNameEn " +
            " from " +
            " ( " +
            " ( " +
            " select s.id as schoolId, s.code as schoolCode, s.name as schoolName, ap.name as levelSchoolName, p.pr_name as provinceName, dp.code as dataPackageCode, dp.name as dataPackageName, " +
            " ap.name_la as levelSchoolNameLa, ap.name_en as levelSchoolNameEn " +
            " from " +
            " data_packages as dp " +
//            " left join schools as s on s.data_package_code = dp.primary_package " +
            " left join schools as s on (s.data_package_code = dp.primary_package or s.data_package_code = dp.code) " +
            " left join province as p on p.pr_id = s.province_id " +
            " left join ap_param ap on ap.code = s.level_shool and type='LEVEL_SCHOOL' " +
            " ) as bangtam1 " +
            " left join " +
            " ( " +
            " SELECT bt1.schoolCode, bt1.dataPackageCode, bt1.create_date, bt1.end_date, " +
            " bt1.countRegisterHasAction1 , bt2.countRegisterHasAction0, " +
            " IFNULL(bt1.countRegisterHasAction1,0) - IFNULL(bt2.countRegisterHasAction0, 0) as countRegister1PackageOf1School " +
            " from " +
            " ( " +
            " select s.code as schoolCode, dp.code as dataPackageCode, rpd.create_date, rpd.end_date, count(*) as countRegisterHasAction1 " +
            " from " +
            " data_packages as dp " +
            " join register_package_details as rpd on rpd.data_package = dp.code " +
//            " join schools as s on s.data_package_code = dp.primary_package " +
            " join register_package as rp on rp.code = rpd.register_package_code\n" +
            " join schools as s on s.code = rp.school_code  " +

            " join province as p on p.pr_id = s.province_id " +
            " join ap_param ap " +
            " where ap.code = s.level_shool and type='LEVEL_SCHOOL' " );

        if (StringUtils.isNotBlank(packageStatisticsDTO.getDate())) {
            sql.append(" AND  date(rpd.create_date) <= DATE('");
            sql.append(packageStatisticsDTO.getDate());
            sql.append("')");
        }

        sql.append(
            " and rpd.action = 1 " +
            " GROUP BY dp.code, s.code " +
            " ) as bt1 " +
            " LEFT JOIN " +
            " ( " +
            " select s.code as schoolCode, dp.code as dataPackageCode, rpd.create_date, rpd.end_date, count(*) as countRegisterHasAction0 " +
            " from " +
            "      data_packages as dp " +
            "      join register_package_details as rpd on rpd.data_package = dp.code " +
//            "      join schools as s on s.data_package_code = dp.primary_package " +
            "      join register_package as rp on rp.code = rpd.register_package_code\n" +
             " join schools as s on s.code = rp.school_code  " +

            "      join province as p on p.pr_id = s.province_id " +
            "      join ap_param ap " +
            "      where ap.code = s.level_shool and type='LEVEL_SCHOOL' " );

        if (StringUtils.isNotBlank(packageStatisticsDTO.getDate())) {
            sql.append(" AND  date(rpd.create_date) <= DATE('");
            sql.append(packageStatisticsDTO.getDate());
            sql.append("')");
        }


        sql.append(
            "      and (rpd.action = 0 or rpd.action = 2) " +
            "      GROUP BY dp.code, s.code " +
            "    ) as bt2 " +
            "        on bt1.schoolCode = bt2.schoolCode and bt1.dataPackageCode = bt2.dataPackageCode " +
            "  ) as bangtam2 " +
            "  on bangtam1.schoolCode = bangtam2.schoolCode and (bangtam1.dataPackageCode = bangtam2.dataPackageCode or bangtam2.dataPackageCode is null) " +
            ") " +
            ") as bangtam3 " +
            "left join " +
            "( " +
            "select tam1.dataPackageCode as dataPackageCodeRegistered,ifnull(sum(tam1.countRegister1PackageOf1School),0) as totalRegistration " +
            "from  " +
            "( " +
            "    select bangtam1.schoolCode, bangtam1.schoolName, bangtam1.levelSchoolName, bangtam1.provinceName,  " +
            "      bangtam1.dataPackageCode, bangtam1.dataPackageName,   " +
            "      bangtam2.dataPackageCode as dataPackageCodeRegistered, bangtam2.countRegister1PackageOf1School, " +
            "      bangtam2.create_date, bangtam2.end_date " +
            "    from  " +
            "    ( " +
            "      ( " +
            "        select s.code as schoolCode, s.name as schoolName, ap.name as levelSchoolName, p.pr_name as provinceName, dp.code as dataPackageCode, dp.name as dataPackageName " +
            "        from " +
            "        data_packages as dp " +
//            "        left join schools as s on s.data_package_code = dp.primary_package " +
            "        left join schools as s on (s.data_package_code = dp.primary_package or s.data_package_code = dp.code) " +

            "        left join province as p on p.pr_id = s.province_id " +
            "        left join ap_param ap on ap.code = s.level_shool and type='LEVEL_SCHOOL' " +
            "      ) as bangtam1 " +
            "      left join " +
            "      ( " +
            "      SELECT bt1.schoolCode, bt1.dataPackageCode, bt1.create_date, bt1.end_date,  " +
            "        bt1.countRegisterHasAction1 , bt2.countRegisterHasAction0,  " +
            "        IFNULL(bt1.countRegisterHasAction1,0) - IFNULL(bt2.countRegisterHasAction0, 0) as countRegister1PackageOf1School " +
            "      from " +
            "      ( " +
            "        select s.code as schoolCode, dp.code as dataPackageCode, rpd.create_date, rpd.end_date, count(*) as countRegisterHasAction1 " +
            "        from " +
            "        data_packages as dp " +
            "        join register_package_details as rpd on rpd.data_package = dp.code " +
//            "        join schools as s on s.data_package_code = dp.primary_package " +
            "        join register_package as rp on rp.code = rpd.register_package_code\n" +
                "                join schools as s on s.code = rp.school_code " +


            "        join province as p on p.pr_id = s.province_id " +
            "        join ap_param ap  " +
            "        where ap.code = s.level_shool and type='LEVEL_SCHOOL' " );

        if (StringUtils.isNotBlank(packageStatisticsDTO.getDate())) {
            sql.append(" AND  date(rpd.create_date) <= DATE('");
            sql.append(packageStatisticsDTO.getDate());
            sql.append("')");
        }

            sql.append(
            "        and rpd.action = 1 " +
            "        GROUP BY dp.code, s.code " +
            "      ) as bt1 " +
            "      LEFT JOIN " +
            "      ( " +
            "        select s.code as schoolCode, dp.code as dataPackageCode, rpd.create_date, rpd.end_date, count(*) as countRegisterHasAction0 " +
            "        from " +
            "        data_packages as dp " +
            "        join register_package_details as rpd on rpd.data_package = dp.code " +
//            "        join schools as s on s.data_package_code = dp.primary_package " +
            "        join register_package as rp on rp.code = rpd.register_package_code\n" +
                "                join schools as s on s.code = rp.school_code " +


            "        join province as p on p.pr_id = s.province_id " +
            "        join ap_param ap  " +
            "        where ap.code = s.level_shool and type='LEVEL_SCHOOL' " );

        if (StringUtils.isNotBlank(packageStatisticsDTO.getDate())) {
            sql.append(" AND  date(rpd.create_date) <= DATE('");
            sql.append(packageStatisticsDTO.getDate());
            sql.append("')");
        }

        sql.append(
            "        and (rpd.action = 0 or rpd.action = 2) " +
            "        GROUP BY dp.code, s.code " +
            "      ) as bt2 " +
            "      on bt1.schoolCode = bt2.schoolCode and bt1.dataPackageCode = bt2.dataPackageCode " +
            "    ) as bangtam2 " +
            "    on bangtam1.schoolCode = bangtam2.schoolCode and (bangtam1.dataPackageCode = bangtam2.dataPackageCode or bangtam2.dataPackageCode is null) " +
            "    )   " +
            "  ) as tam1 " +
            "  GROUP BY tam1.dataPackageCode " +
            ") as bangtam4  " +
            "on bangtam3.dataPackageCode = bangtam4.dataPackageCodeRegistered where 1=1 ");

        if (StringUtils.isNotBlank(packageStatisticsDTO.getSchoolSearch())) {

            sql.append(" AND ( upper(bangtam3.schoolCode) LIKE upper('%"+validateKeySearch(packageStatisticsDTO.getSchoolSearch().trim())+"%') escape '&' " +
                "OR upper(bangtam3.schoolName) LIKE upper('%"+validateKeySearch(packageStatisticsDTO.getSchoolSearch().trim())+"%') escape '&' )");
        }

        if (StringUtils.isNotBlank(packageStatisticsDTO.getPackageSearch())) {
            sql.append(" AND ( upper(bangtam3.dataPackageName) LIKE upper('%"+validateKeySearch(packageStatisticsDTO.getPackageSearch().trim())+"%') escape '&' " +
                "OR upper(bangtam3.dataPackageCode) LIKE upper('%"+validateKeySearch(packageStatisticsDTO.getPackageSearch().trim())+"%') escape '&' )");
        }

        sql.append(" ORDER BY dataPackageCode, dataPackageName, schoolCode, schoolName ");

        Query query = entityManager.createNativeQuery(sql.toString());
        List<Object[]> resultList = query.getResultList();
        if(language.equals("vn")){
            for(Object[] obj : resultList){
                PackageStatisticsResultDTO dto = new PackageStatisticsResultDTO();
                dto.setSchoolCode(DataUtil.safeToString(obj[0]));
                dto.setSchoolName(DataUtil.safeToString(obj[1]));
                dto.setProvinceName(DataUtil.safeToString(obj[3]));
                dto.setDataPackageCode(DataUtil.safeToString(obj[4]));
                dto.setDataPackageName(DataUtil.safeToString(obj[5]));
                dto.setDataPackageCodeRegistered(DataUtil.safeToString(obj[6]));
                dto.setCountRegister1PackageOf1School(DataUtil.safeToLong(obj[7]));
                dto.setCreate_date(DataUtil.safeToInstant(obj[8]));
                dto.setEnd_date(DataUtil.safeToDate(obj[9]));
                dto.setTotalRegistration(DataUtil.safeToLong(obj[10]));
                dto.setSchoolId(DataUtil.safeToString(obj[11]));
                dto.setLevelSchoolName(DataUtil.safeToString(obj[2]));
                list.add(dto);
            }
        }

        if(language.equals("la")){
            for(Object[] obj : resultList){
                PackageStatisticsResultDTO dto = new PackageStatisticsResultDTO();
                dto.setSchoolCode(DataUtil.safeToString(obj[0]));
                dto.setSchoolName(DataUtil.safeToString(obj[1]));
                dto.setProvinceName(DataUtil.safeToString(obj[3]));
                dto.setDataPackageCode(DataUtil.safeToString(obj[4]));
                dto.setDataPackageName(DataUtil.safeToString(obj[5]));
                dto.setDataPackageCodeRegistered(DataUtil.safeToString(obj[6]));
                dto.setCountRegister1PackageOf1School(DataUtil.safeToLong(obj[7]));
                dto.setCreate_date(DataUtil.safeToInstant(obj[8]));
                dto.setEnd_date(DataUtil.safeToDate(obj[9]));
                dto.setTotalRegistration(DataUtil.safeToLong(obj[10]));
                dto.setSchoolId(DataUtil.safeToString(obj[11]));
                dto.setLevelSchoolName(DataUtil.safeToString(obj[12]));
                list.add(dto);
            }
        }
        if(language.equals("en")){
            for(Object[] obj : resultList){
                PackageStatisticsResultDTO dto = new PackageStatisticsResultDTO();
                dto.setSchoolCode(DataUtil.safeToString(obj[0]));
                dto.setSchoolName(DataUtil.safeToString(obj[1]));
                dto.setProvinceName(DataUtil.safeToString(obj[3]));
                dto.setDataPackageCode(DataUtil.safeToString(obj[4]));
                dto.setDataPackageName(DataUtil.safeToString(obj[5]));
                dto.setDataPackageCodeRegistered(DataUtil.safeToString(obj[6]));
                dto.setCountRegister1PackageOf1School(DataUtil.safeToLong(obj[7]));
                dto.setCreate_date(DataUtil.safeToInstant(obj[8]));
                dto.setEnd_date(DataUtil.safeToDate(obj[9]));
                dto.setTotalRegistration(DataUtil.safeToLong(obj[10]));
                dto.setSchoolId(DataUtil.safeToString(obj[11]));
                dto.setLevelSchoolName(DataUtil.safeToString(obj[13]));
                list.add(dto);
            }
        }
        return list;
    }


    @Override
    public List<PackageStatisticsByMonthDTO> monthlyStatistics(PackageStatisticsDTO packageStatisticsDTO) {

        List<PackageStatisticsByMonthDTO> listData = new ArrayList<>();

        StringBuilder sql = new StringBuilder("select Sum(if(month=1,number_send_sms,0)) as January,\n" +
            "\t\tSum(if(month=2,number_send_sms,0)) as February,\n" +
            "        Sum(if(month=3,number_send_sms,0)) as March,\n" +
            "        Sum(if(month=4,number_send_sms,0)) as April,\n" +
            "        Sum(if(month=5,number_send_sms,0)) as May,\n" +
            "        Sum(if(month=6,number_send_sms,0)) as June,\n" +
            "        Sum(if(month=7,number_send_sms,0)) as July,\n" +
            "        Sum(if(month=8,number_send_sms,0)) as August,\n" +
            "        Sum(if(month=9,number_send_sms,0)) as September,\n" +
            "        Sum(if(month=10,number_send_sms,0)) as October,\n" +
            "        Sum(if(month=11,number_send_sms,0)) as November,\n" +
            "        Sum(if(month=12,number_send_sms,0)) as December\n" +
            "FROM unitel.report_send_message\n" +
            "where school_code = :schoolCode \n" +
            "and package_code= :packageCode \n" +
            "and year = :year ");


        Query query = entityManager.createNativeQuery(sql.toString());

        query.setParameter("schoolCode", packageStatisticsDTO.getSchoolSearch());
        query.setParameter("packageCode", packageStatisticsDTO.getPackageSearch());
        query.setParameter("year", packageStatisticsDTO.getYear());

        List<Object[]> resultList = query.getResultList();

        for(Object[] obj : resultList){
            PackageStatisticsByMonthDTO dto = new PackageStatisticsByMonthDTO();
            dto.setJanuary(DataUtil.safeToDouble(obj[0]).longValue());
            dto.setFebruary(DataUtil.safeToDouble(obj[1]).longValue());
            dto.setMarch(DataUtil.safeToDouble(obj[2]).longValue());
            dto.setApril(DataUtil.safeToDouble(obj[3]).longValue());
            dto.setMay(DataUtil.safeToDouble(obj[4]).longValue());
            dto.setJune(DataUtil.safeToDouble(obj[5]).longValue());
            dto.setJuly(DataUtil.safeToDouble(obj[6]).longValue());
            dto.setAugust(DataUtil.safeToDouble(obj[7]).longValue());
            dto.setSeptember(DataUtil.safeToDouble(obj[8]).longValue());
            dto.setOctober(DataUtil.safeToDouble(obj[9]).longValue());
            dto.setNovember(DataUtil.safeToDouble(obj[10]).longValue());
            dto.setDecember(DataUtil.safeToDouble(obj[11]).longValue());
            listData.add(dto);
        }
        return listData;
    }

    public static String validateKeySearch(String str){
        return str.replaceAll("&", "&&").replaceAll("%", "&%").replaceAll("_", "&_");
    }
}
