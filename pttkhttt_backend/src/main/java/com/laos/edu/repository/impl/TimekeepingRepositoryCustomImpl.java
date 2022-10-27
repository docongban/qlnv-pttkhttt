package com.laos.edu.repository.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.domain.Timekeeping;
import com.laos.edu.repository.TimekeepingRepository;
import com.laos.edu.repository.TimekeepingRepositoryCustom;
import com.laos.edu.service.dto.TimekeepingDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TimekeepingRepositoryCustomImpl implements TimekeepingRepositoryCustom {
    @Autowired
    EntityManager entityManager;

    private static final String CODE_OR_NAME = "codeOrName";

    private static final String FROM_DATE = "fromDate";

    private static final String TO_DATE = "toDate";

    @Override
    public Page<TimekeepingDTO> doSearch(TimekeepingDTO timekeepingDTO, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        List<TimekeepingDTO> list = new ArrayList<>();

        StringBuilder sql = new StringBuilder("select t.employee_code, e.name, e.sex, e.phone_number, e.email, e.address, t.time_at from timekeeping t \n" +
            "inner join employee e on t.employee_code = e.code \n" +
            "where true ");

        if(timekeepingDTO.getEmployeeCode() != null){
            sql.append(" and (upper(e.code) like upper(:codeOrName) or upper(e.name) like upper(:codeOrName)) ");
        }
        if(timekeepingDTO.getFromDate() != null){
            sql.append(" and t.time_at >= :fromDate ");
        }
        if(timekeepingDTO.getToDate() != null){
            sql.append(" and t.time_at <= :toDate ");
        }

        sql.append(" order by t.time_at asc ");

        Query query = entityManager.createNativeQuery(sql.toString());
        Query countQuery = entityManager.createNativeQuery("SELECT COUNT(*) FROM (" + sql + ") as x");

        if (timekeepingDTO.getEmployeeCode() != null) {
            query.setParameter(CODE_OR_NAME, "%" + timekeepingDTO.getEmployeeCode() +"%");
            countQuery.setParameter(CODE_OR_NAME, "%" + timekeepingDTO.getEmployeeCode() +"%");
        }
        if(timekeepingDTO.getFromDate() != null){
            query.setParameter(FROM_DATE, timekeepingDTO.getFromDate());
            countQuery.setParameter(FROM_DATE, timekeepingDTO.getFromDate());
        }
        if(timekeepingDTO.getToDate() != null){
            query.setParameter(TO_DATE, timekeepingDTO.getToDate());
            countQuery.setParameter(TO_DATE, timekeepingDTO.getToDate());;
        }

        long countResult = ((BigInteger) countQuery.getSingleResult()).longValue();
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Object[]> lstObj = query.getResultList();
        if (lstObj != null && !lstObj.isEmpty()){
            for (Object[] obj : lstObj){
                TimekeepingDTO dto=new TimekeepingDTO();

                dto.setEmployeeCode(DataUtil.safeToString(obj[0]));
                dto.setEmployeeName(DataUtil.safeToString(obj[1]));
                dto.setEmployeeSex(DataUtil.safeToString(obj[2]));
                dto.setEmployeePhoneNumber(DataUtil.safeToString(obj[3]));
                dto.setEmployeeEmail(DataUtil.safeToString(obj[4]));
                dto.setEmployeeAddress(DataUtil.safeToString(obj[5]));
                dto.setTimeAt(DataUtil.safeToInstant(obj[6]));

                list.add(dto);
            }
        }
        return new PageImpl<>(list, pageable, countResult);
    }

    @Override
    public List<TimekeepingDTO> searchAll(TimekeepingDTO timekeepingDTO) {
        List<TimekeepingDTO> list = new ArrayList<>();

        StringBuilder sql = new StringBuilder("select t.employee_code, e.name, e.sex, e.phone_number, e.email, e.address, t.time_at from timekeeping t \n" +
            "inner join employee e on t.employee_code = e.code \n" +
            "where true ");

        if(timekeepingDTO.getEmployeeCode() != null){
            sql.append(" (upper(e.code) like upper(:codeOrName) or upper(e.name) like upper(:codeOrName%)) ");
        }
        if(timekeepingDTO.getFromDate() != null){
            sql.append(" and t.time_at >= :fromDate ");
        }
        if(timekeepingDTO.getToDate() != null){
            sql.append(" and t.time_at <= :toDate ");
        }

        sql.append(" order by e.name asc ");

        Query query = entityManager.createNativeQuery(sql.toString());
        Query countQuery = entityManager.createNativeQuery("SELECT COUNT(*) FROM (" + sql + ") as x");

        if (timekeepingDTO.getEmployeeCode() != null) {
            query.setParameter(CODE_OR_NAME, "%" + timekeepingDTO.getEmployeeCode() +"%");
            countQuery.setParameter(CODE_OR_NAME, "%" + timekeepingDTO.getEmployeeCode() +"%");
        }
        if(timekeepingDTO.getFromDate() != null){
            query.setParameter(FROM_DATE, timekeepingDTO.getFromDate());
            countQuery.setParameter(FROM_DATE, timekeepingDTO.getFromDate());
        }
        if(timekeepingDTO.getToDate() != null){
            query.setParameter(TO_DATE, timekeepingDTO.getToDate());
            countQuery.setParameter(TO_DATE, timekeepingDTO.getToDate());;
        }

        List<Object[]> lstObj = query.getResultList();
        if (lstObj != null && !lstObj.isEmpty()){
            for (Object[] obj : lstObj){
                TimekeepingDTO dto=new TimekeepingDTO();

                dto.setEmployeeCode(DataUtil.safeToString(obj[0]));
                dto.setEmployeeName(DataUtil.safeToString(obj[1]));
                dto.setEmployeeSex(DataUtil.safeToString(obj[2]));
                dto.setEmployeePhoneNumber(DataUtil.safeToString(obj[3]));
                dto.setEmployeeEmail(DataUtil.safeToString(obj[4]));
                dto.setEmployeeAddress(DataUtil.safeToString(obj[5]));
                dto.setTimeAt(DataUtil.safeToInstant(obj[6]));

                list.add(dto);
            }
        }
        return list;
    }
}
