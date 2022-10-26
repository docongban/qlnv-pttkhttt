package com.laos.edu.repository.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.domain.RegisterPackageDetails;
import com.laos.edu.repository.ManagementRegistrationCustomerRepository;
import com.laos.edu.service.dto.ManagementRegistrationDTO;
import com.laos.edu.service.dto.ManagementRegistrationResultDTO;
import com.laos.edu.service.dto.RegisterPackageDetailsDTO;
import io.micrometer.core.instrument.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class ManagementRegistrationCustomerRepositoryImpl implements ManagementRegistrationCustomerRepository {

    private final Logger log = LoggerFactory.getLogger(ManagementRegistrationCustomerRepositoryImpl.class);

    @Autowired
    EntityManager entityManager;

    @Override
    public ManagementRegistrationResultDTO searchManagementRegistration(ManagementRegistrationDTO managementRegistrationDTO) {

        ManagementRegistrationResultDTO managementRegistrationResultDTO = new ManagementRegistrationResultDTO();

        List<ManagementRegistrationDTO> list = new ArrayList<>();

        StringBuilder sql = new StringBuilder("select DISTINCT a.student_code, a.student_name, a.phone,\n" +
            "       b.data_package, b.create_date, b.creator, b.start_date, b.end_date, b.active_date, b.status,\n" +
            "       c.name as schoolName, b.id \n" +
            "from register_package a\n" +
            "join register_package_details b on a.code = b.register_package_code \n" +
            "join schools c on a.school_code = c.code \n" +
            "join \n" +
            "(\n" +
            "\tselect a.student_code, max(b.create_date) as create_date_max\n" +
            "    from register_package a\n" +
            "\tjoin register_package_details b on a.code = b.register_package_code \n" +
            "    join schools c on a.school_code = c.code \n" +
            "    group by binary a.student_code, b.start_date, b.end_date, c.code\n" +
            ") as tam1 on tam1.student_code = a.student_code and b.create_date = tam1.create_date_max ");

        if (StringUtils.isNotBlank(managementRegistrationDTO.getSchoolCode())) {
            sql.append(" AND  a.school_code = binary '");
            sql.append(managementRegistrationDTO.getSchoolCode());
            sql.append("' ");
        }

        if (StringUtils.isNotBlank(managementRegistrationDTO.getDataPackage())) {
            sql.append(" AND  b.data_package = binary '");
            sql.append(managementRegistrationDTO.getDataPackage());
            sql.append("' ");
        }

        if (managementRegistrationDTO.getStatus() != null) {
            sql.append(" AND  b.status = ");
            sql.append(managementRegistrationDTO.getStatus() );
        }

        if (StringUtils.isNotBlank(managementRegistrationDTO.getFromDateSearch())) {
            sql.append(" AND  (Date(b.create_date) > Date('");
            sql.append(managementRegistrationDTO.getFromDateSearch());
            sql.append("') or Date(b.create_date) = Date('");
            sql.append(managementRegistrationDTO.getFromDateSearch());
            sql.append("'))");

        }

        if (StringUtils.isNotBlank(managementRegistrationDTO.getToDateSearch())) {
            sql.append(" AND  (Date(b.create_date) < Date('");
            sql.append(managementRegistrationDTO.getToDateSearch());
            sql.append("') or Date(b.create_date) = Date('");
            sql.append(managementRegistrationDTO.getToDateSearch());
            sql.append("'))");
        }

        if (StringUtils.isNotBlank(managementRegistrationDTO.getPhoneSearch())) {
            sql.append(" AND (a.phone LIKE ('%"+validateKeySearch(managementRegistrationDTO.getPhoneSearch().trim())+"%') escape '&' )" );
        }


        StringBuilder sql1 = sql;
        Query query1 = entityManager.createNativeQuery(sql.toString());
        List<Object[]> resultList1 = query1.getResultList();

        if( managementRegistrationDTO.getPage() != null && managementRegistrationDTO.getPageSize() !=null){
            Integer offset;
            long a= managementRegistrationDTO.getPage();
            long b = managementRegistrationDTO.getPageSize();
            if ((int)a <= 1) {
                offset = 0;
            }else{
                offset = ((int)a - 1) * (int)b;
            }
            sql.append(" ORDER BY b.create_date DESC ,a.student_name ASC, a.student_code ASC LIMIT "+offset+" , "+(int)b+" ");
        }
        else {
            sql.append(" ORDER BY b.create_date DESC ,a.student_name ASC, a.student_code ASC ");
        }

        Query query = entityManager.createNativeQuery(sql.toString());
        List<Object[]> resultList = query.getResultList();
        for(Object[] obj : resultList){
            ManagementRegistrationDTO dto = new ManagementRegistrationDTO();
            dto.setStudentCode(DataUtil.safeToString(obj[0]));
            dto.setStudentName(DataUtil.safeToString(obj[1]));
            dto.setPhone(DataUtil.safeToString(obj[2]));
            dto.setDataPackage(DataUtil.safeToString(obj[3]));
            dto.setCreateDate(DataUtil.safeToInstant(obj[4]));
            dto.setCreator(DataUtil.safeToString(obj[5]));
            dto.setStartDate(DataUtil.safeToDate(obj[6]));
            dto.setEndDate(DataUtil.safeToDate(obj[7]));
            dto.setActiveDate(DataUtil.safeToDate(obj[8]));
            dto.setStatus(DataUtil.safeToLong(obj[9]));
            dto.setSchoolName(DataUtil.safeToString(obj[10]));
            dto.setId(DataUtil.safeToLong(obj[11]));
            list.add(dto);
        }
        managementRegistrationResultDTO.setManagementRegistrationDTOS(list);
        managementRegistrationResultDTO.setPage(managementRegistrationDTO.getPage());
        managementRegistrationResultDTO.setPageSize(managementRegistrationDTO.getPageSize());
        managementRegistrationResultDTO.setTotalRecord((long) resultList1.size());

        return managementRegistrationResultDTO;
    }

    @Override
    public List<RegisterPackageDetails> findToActive(List<Long> listId) {
        StringBuilder sql = new StringBuilder("select * from register_package_details WHERE id in (");
        StringBuilder listId1 = new StringBuilder();
        for (Long item: listId) {
            if(com.laos.edu.commons.StringUtils.isNotNullOrEmpty(listId1.toString())){
                listId1.append(",");
                listId1.append(item);
            }
            else{
                listId1.append(item);
            }
        }
        sql.append(listId1);
        sql.append(")");

        Query query = entityManager.createNativeQuery(sql.toString());
        List<Object[]> resultList = query.getResultList();
        List<RegisterPackageDetails> list = new ArrayList<>();
        for(Object[] obj : resultList){
            RegisterPackageDetails dto = new RegisterPackageDetails();
            dto.setId(DataUtil.safeToLong(obj[0]));
            dto.setStatus(DataUtil.safeToLong(obj[1]));
            dto.setDataPackage(DataUtil.safeToString(obj[2]));
            dto.setCreateDate(DataUtil.safeToInstant(obj[3]));
            dto.setCreator(DataUtil.safeToString(obj[4]));
            dto.setAction(DataUtil.safeToLong(obj[5]));
//          Instant e = LocalDate.parse(q.toString()).atStartOfDay(ZoneId.systemDefault()).toInstant();
//            dto.setActiveDate(LocalDate.parse(DataUtil.safeToDate(obj[6]).toString()).atStartOfDay(ZoneId.systemDefault()).toInstant());
            dto.setStartDate(LocalDate.parse(DataUtil.safeToDate(obj[7]).toString()).atStartOfDay(ZoneId.systemDefault()).toInstant());
            dto.setEndDate(LocalDate.parse(DataUtil.safeToDate(obj[8]).toString()).atStartOfDay(ZoneId.systemDefault()).toInstant());
            dto.setRegisPackIdSchool(DataUtil.safeToLong(obj[9]));
            dto.setRegisterPackageCode(DataUtil.safeToString(obj[10]));
            list.add(dto);
        }

        return list;
    }


    public static String validateKeySearch(String str){
        return str.replaceAll("&", "&&").replaceAll("%", "&%").replaceAll("_", "&_");
    }
}
