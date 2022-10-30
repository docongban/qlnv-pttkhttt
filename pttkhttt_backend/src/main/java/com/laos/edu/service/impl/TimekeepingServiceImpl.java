package com.laos.edu.service.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.domain.Timekeeping;
import com.laos.edu.repository.TimekeepingRepository;
import com.laos.edu.service.TimekeepingService;
import com.laos.edu.service.dto.ServiceResult;
import com.laos.edu.service.dto.TimekeepingDTO;
import com.laos.edu.service.dto.TimekeepingExportDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TimekeepingServiceImpl implements TimekeepingService {

    @Autowired
    TimekeepingRepository timekeepingRepository;

    @Autowired
    EntityManager entityManager;

    @Override
    public Page<TimekeepingDTO> doSearch(TimekeepingDTO timekeepingDTO, int page, int pageSize) {
        return timekeepingRepository.doSearch(timekeepingDTO, page, pageSize);
    }

    @Override
    public ServiceResult createTimekeeping(Timekeeping timekeeping) {
        ServiceResult rs = new ServiceResult();
        Timekeeping save = timekeeping;
        save.setCreatedTime(Instant.now());
        try{
            timekeepingRepository.save(save);

            rs.setData(save);
            rs.setMessage("Thêm mới công thành công");
            rs.setStatus(HttpStatus.OK);
        }catch (Exception e){
            rs.setData(null);
            rs.setMessage("Thêm mới công thất bại");
            rs.setStatus(HttpStatus.NOT_FOUND);
        }
        return rs;
    }

    @Override
    public ServiceResult updateTimekeeping(Timekeeping timekeeping) {
        ServiceResult rs = new ServiceResult();

        Timekeeping update = timekeepingRepository.findById(timekeeping.getId()).get();
        update.setUpdatedTime(Instant.now());
        update.setTimeAt(timekeeping.getTimeAt());
        try{
            timekeepingRepository.save(update);

            rs.setData(update);
            rs.setMessage("Cập nhật công thành công");
            rs.setStatus(HttpStatus.OK);
        }catch (Exception e){
            rs.setData(null);
            rs.setMessage("Cập nhật công thất bại");
            rs.setStatus(HttpStatus.NOT_FOUND);
        }
        return rs;
    }

    @Override
    public ServiceResult deleteTimekeeping(TimekeepingDTO timekeepingDTO) {
        ServiceResult rs = new ServiceResult();

        Timekeeping delete = timekeepingRepository.findById(timekeepingDTO.getId()).get();

        try{
            timekeepingRepository.delete(delete);

            rs.setData(delete);
            rs.setMessage("Xóa công thành công");
            rs.setStatus(HttpStatus.OK);
        }catch (Exception e){
            rs.setData(null);
            rs.setMessage("Xóa công thất bại");
            rs.setStatus(HttpStatus.NOT_FOUND);
        }
        return rs;
    }

    @Override
    public List<TimekeepingExportDTO> exort(TimekeepingDTO timekeepingDTO) {
        List<TimekeepingExportDTO> list = new ArrayList<>();
        List<TimekeepingDTO> data = timekeepingRepository.searchAll(timekeepingDTO);

        if(data.size()!=0){
            for(TimekeepingDTO item: data){
                TimekeepingExportDTO dto=new TimekeepingExportDTO();

                dto.setEmployeeCode(item.getEmployeeCode());
                dto.setEmployeeName(item.getEmployeeName());
                dto.setEmployeeSex(item.getEmployeeSex());
                dto.setEmployeePhoneNumber(item.getEmployeePhoneNumber());
                dto.setEmployeeEmail(item.getEmployeeEmail());
                dto.setEmployeeAddress(item.getEmployeeAddress());
                dto.setTimeAt(item.getTimeAt());

                list.add(dto);
            }
        }
        return list;
    }

    @Override
    public TimekeepingDTO getById(TimekeepingDTO timekeepingDTO) {
        StringBuilder sql = new StringBuilder("select t.employee_code, e.name, e.sex, e.phone_number, e.email, e.address, t.time_at, t.id from timekeeping t \n" +
            "inner join employee e on t.employee_code = e.code \n" +
            "where t.id =  ");
        sql.append(timekeepingDTO.getId());
        Query query = entityManager.createNativeQuery(sql.toString());
        TimekeepingDTO dto=new TimekeepingDTO();
        List<Object[]> lstObj = query.getResultList();
        if (lstObj != null && !lstObj.isEmpty()){
            for (Object[] obj : lstObj){

                dto.setEmployeeCode(DataUtil.safeToString(obj[0]));
                dto.setEmployeeName(DataUtil.safeToString(obj[1]));
                dto.setEmployeeSex(DataUtil.safeToString(obj[2]));
                dto.setEmployeePhoneNumber(DataUtil.safeToString(obj[3]));
                dto.setEmployeeEmail(DataUtil.safeToString(obj[4]));
                dto.setEmployeeAddress(DataUtil.safeToString(obj[5]));
                dto.setTimeAt(DataUtil.safeToInstant(obj[6]));
                dto.setId(DataUtil.safeToInt(obj[7]));

                break;
            }
        }
        return dto;
    }
}
