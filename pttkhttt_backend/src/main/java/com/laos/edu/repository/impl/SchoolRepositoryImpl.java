package com.laos.edu.repository.impl;

import com.laos.edu.commons.Translator;
import com.laos.edu.domain.School;
import com.laos.edu.repository.SchoolRepositoryCustom;
import com.laos.edu.service.dto.DataPackageDTO;
import com.laos.edu.service.dto.SchoolDTO;
import com.laos.edu.service.dto.SearchSchoolDTO;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.*;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;
import java.util.Locale;

@Repository
public class SchoolRepositoryImpl implements SchoolRepositoryCustom {

    private EntityManager entityManager;

    public SchoolRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<DataPackageDTO> getRecruivePackage(String code) {
        StringBuilder sql = new StringBuilder()
            .append("with recursive cte  as (   " +
                "  select    dp.id id, dp.code code, dp.name name, dp.level_school levelSchool,pp.prices prices,dp.quantity_sms quantitySms   " +
                "  ,dp.quantity_semester_apply quantitySemesterApply,dp.semester_apply semesterApply,dp.type_package typePackage,dp.primary_package primaryPackage  " +
                "   ,pp.apply_date applyDate , dp.service AS service " +
                "  from       data_packages dp   " +
                "  left join package_price pp on pp.package_code =dp.code   " +
                "  where      dp.code = :code  " +
                "  union all   " +
                "  select   dp1.id id, dp1.code code, dp1.name name, dp1.level_school levelSchool,pp.prices prices,dp1.quantity_sms quantitySms   " +
                "  ,dp1.quantity_semester_apply quantitySemesterApply,dp1.semester_apply semesterApply,dp1.type_package typePackage ,dp1.primary_package primaryPackage  " +
                "    ,pp.apply_date applyDate , dp1.service AS service " +
                "  from       data_packages dp1   " +
                "  left join package_price pp on pp.package_code =dp1.code   " +
                "  join cte on dp1.primary_package = cte.code   " +
                ")   " +
                "select DISTINCT * from cte ct1 " +
                "where ct1.applyDate = (select MAX(ct2.applyDate) from cte ct2 where ct2.code = ct1.code);");
        Query query = this.entityManager.createNativeQuery(sql.toString());
        query.setParameter("code", code);
        query.unwrap(SQLQuery.class)
            .addScalar("id", new LongType())
            .addScalar("code", new StringType())
            .addScalar("name", new StringType())
            .addScalar("levelSchool", new StringType())
            .addScalar("prices", new BigDecimalType())
            .addScalar("quantitySms", new LongType())
            .addScalar("quantitySemesterApply", new LongType())
            .addScalar("semesterApply", new StringType())
//            .addScalar("applyDate", new InstantType())
            .addScalar("typePackage", new LongType())
            .addScalar("service", new StringType())
            .addScalar("primaryPackage", new StringType()).setResultTransformer(Transformers.aliasToBean(DataPackageDTO.class));
        List<DataPackageDTO> resultList = query.getResultList();
        return resultList;
    }

    @Override
    public List<SchoolDTO> search(SearchSchoolDTO searchSchoolDTO, Integer page, Integer pageSize) {
        StringBuilder sql = new StringBuilder();
        if(searchSchoolDTO.getLangKey().equals("vn")){
            sql.append("select s.id, s.code, ")
                .append("s.name, ")
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool as levelShool, ")
                .append("p.pr_name_en as provinceName, ")
                .append("s.data_package_code as dataPackageCode, ")
                .append("s.status, ")
                .append("s.created_time as createdTime, ")
                .append("dp.name as dataPackageName, ")
                .append("ap.name as levelSchoolName ")
                .append("from schools s left join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code  ")
                .append("where 1 = 1");
        }else if(searchSchoolDTO.getLangKey().equals("la")){
            sql.append("select s.id, s.code, ")
                .append("s.name, ")
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool as levelShool, ")
                .append("p.pr_name as provinceName, ")
                .append("s.data_package_code as dataPackageCode, ")
                .append("s.status, ")
                .append("s.created_time as createdTime, ")
                .append("dp.name as dataPackageName, ")
                .append("ap.name_la as levelSchoolName ")
                .append("from schools s left join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code  ")
                .append("where 1 = 1");
        }else{
            sql.append("select s.id, s.code, ")
                .append("s.name, ")
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool as levelShool, ")
                .append("p.pr_name_en as provinceName, ")
                .append("s.data_package_code as dataPackageCode, ")
                .append("s.status, ")
                .append("s.created_time as createdTime, ")
                .append("dp.name as dataPackageName, ")
                .append("ap.name_en as levelSchoolName ")
                .append("from schools s left join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code  ")
                .append("where 1 = 1");
        }
        if(!searchSchoolDTO.getCode().isEmpty()){
            sql.append(" AND s.code like CONCAT( '%',UPPER(:code), '%')");
        }
        if(!searchSchoolDTO.getName().isEmpty()){
            sql.append(" AND (UPPER(s.name) like CONCAT( '%',UPPER(:name), '%' ) or UPPER(s.abbreviation_name) like CONCAT( '%',UPPER(:name), '%' ))");
        }
        if(null != searchSchoolDTO.getLevelSchool()){
            sql.append(" AND s.level_shool = :levelSchool ");
        }
        if(null != searchSchoolDTO.getProvinceId()){
            sql.append(" AND p.pr_id = :provinceId ");
        }
        if(null != searchSchoolDTO.getStatus()){
            sql.append(" AND s.status = :status ");
        }
//        sql.append(" ORDER BY s.created_time ");
        if (page != null && pageSize != null) {
            Integer offset;
            if (page <= 1) {
                offset = 0;
            } else {
                offset = (page - 1) * pageSize;
            }
            sql.append(" ORDER BY s.created_time LIMIT " + offset + " , " + pageSize + " ");
        } else {
            sql.append(" ORDER BY s.created_time ");
        }
        NativeQuery<SchoolDTO> query = ((Session) entityManager.getDelegate()).createNativeQuery(sql.toString());
        query.addScalar("id", new LongType()).addScalar("createdTime", new InstantType())
            .addScalar("name", new StringType()).addScalar("dataPackageCode", new StringType())
            .addScalar("code", new StringType()).addScalar("abbreviationName", new StringType())
            .addScalar("levelShool", new StringType()).addScalar("provinceName", new StringType())
            .addScalar("status", new LongType()).addScalar("dataPackageName", new StringType()).addScalar("levelSchoolName", new StringType())
            .setResultTransformer(Transformers.aliasToBean(SchoolDTO.class));
        if(!searchSchoolDTO.getCode().isEmpty()){
            query.setParameter("code", searchSchoolDTO.getCode());
        }
        if(!searchSchoolDTO.getName().isEmpty()){
            query.setParameter("name", searchSchoolDTO.getName());
        }
        if(null != searchSchoolDTO.getLevelSchool()){
            query.setParameter("levelSchool", searchSchoolDTO.getLevelSchool());
        }
        if(null != searchSchoolDTO.getProvinceId()){
            query.setParameter("provinceId", searchSchoolDTO.getProvinceId());
        }
        if(null != searchSchoolDTO.getStatus()){
            query.setParameter("status", searchSchoolDTO.getStatus());
        }
        return query.list();
    }

    @Override
    public List<SchoolDTO> exportData(SearchSchoolDTO searchSchoolDTO) {
        StringBuilder sql = new StringBuilder();
        if(searchSchoolDTO.getLangKey().equals("vn")){
            sql.append("select s.id, s.code, ")
               .append("s.name, ")
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool as levelShool, ")
                .append("p.pr_name_en as provinceName, ")
                .append("s.data_package_code as dataPackageCode, ")
                .append("s.status, ")
                .append("case when s.status = 0 then '" + Translator.toLocale("school.status.lock") + "' else '" + Translator.toLocale("school.status.active") + "' end statusStr, ")
                .append("s.created_time as createdTime, ")
                .append("DATE_FORMAT(s.created_time, '%Y-%m-%d') as createDate, ")
                .append("dp.name as dataPackageName, ")
                .append("ap.name as levelSchoolName ")
                .append("from schools s left join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code  ")
                .append("where 1 = 1");
        }else if(searchSchoolDTO.getLangKey().equals("la")){
            sql.append("select s.id, s.code, ")
                .append("s.name, ")
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool as levelShool, ")
                .append("p.pr_name as provinceName, ")
                .append("s.data_package_code as dataPackageCode, ")
                .append("s.status, ")
                .append("case when s.status = 0 then '" + Translator.toLocale("school.status.lock") + "' else '" + Translator.toLocale("school.status.active") + "' end statusStr, ")
                .append("s.created_time as createdTime, ")
                .append("DATE_FORMAT(s.created_time, '%Y-%m-%d') as createDate, ")
                .append("dp.name as dataPackageName, ")
                .append("ap.name_la as levelSchoolName ")
                .append("from schools s left join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code  ")
                .append("where 1 = 1");
        }else{
            sql.append("select s.id, s.code, ")
                .append("s.name, ")
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool as levelShool, ")
                .append("p.pr_name_en as provinceName, ")
                .append("s.data_package_code as dataPackageCode, ")
                .append("s.status, ")
                .append("case when s.status = 0 then '" + Translator.toLocale("school.status.lock") + "' else '" + Translator.toLocale("school.status.active") + "' end statusStr, ")
                .append("s.created_time as createdTime, ")
                .append("DATE_FORMAT(s.created_time, '%Y-%m-%d') as createDate, ")
                .append("dp.name as dataPackageName, ")
                .append("ap.name_en as levelSchoolName ")
                .append("from schools s left join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code  ")
                .append("where 1 = 1");
        }
        if(!searchSchoolDTO.getCode().isEmpty()){
            sql.append(" AND s.code like CONCAT( '%',UPPER(:code), '%')");
        }
        if(!searchSchoolDTO.getName().isEmpty()){
            sql.append(" AND (UPPER(s.name) like CONCAT( '%',UPPER(:name), '%' ) or UPPER(s.abbreviation_name) like CONCAT( '%',UPPER(:name), '%' ))");
        }
        if(null != searchSchoolDTO.getLevelSchool()){
            sql.append(" AND s.level_shool = :levelSchool ");
        }
        if(null != searchSchoolDTO.getProvinceId()){
            sql.append(" AND p.pr_id = :provinceId ");
        }
        if(null != searchSchoolDTO.getStatus()){
            sql.append(" AND s.status = :status ");
        }
        sql.append(" ORDER BY s.created_time ");
        NativeQuery<SchoolDTO> query = ((Session) entityManager.getDelegate()).createNativeQuery(sql.toString());
        query.addScalar("id", new LongType()).addScalar("createdTime", new InstantType())
            .addScalar("createDate", new DateType())
            .addScalar("name", new StringType()).addScalar("dataPackageCode", new StringType())
            .addScalar("code", new StringType()).addScalar("abbreviationName", new StringType())
            .addScalar("levelShool", new StringType()).addScalar("provinceName", new StringType())
            .addScalar("status", new LongType()).addScalar("dataPackageName", new StringType())
            .addScalar("levelSchoolName", new StringType()).addScalar("statusStr", new StringType())
            .setResultTransformer(Transformers.aliasToBean(SchoolDTO.class));
        if(!searchSchoolDTO.getCode().isEmpty()){
            query.setParameter("code", searchSchoolDTO.getCode());
        }
        if(!searchSchoolDTO.getName().isEmpty()){
            query.setParameter("name", searchSchoolDTO.getName());
        }
        if(null != searchSchoolDTO.getLevelSchool()){
            query.setParameter("levelSchool", searchSchoolDTO.getLevelSchool());
        }
        if(null != searchSchoolDTO.getProvinceId()){
            query.setParameter("provinceId", searchSchoolDTO.getProvinceId());
        }
        if(null != searchSchoolDTO.getStatus()){
            query.setParameter("status", searchSchoolDTO.getStatus());
        }
        return query.list();
    }

    @Override
    public SchoolDTO getInforSchool(Long id) {
        Locale locale = LocaleContextHolder.getLocale();
        StringBuilder sql = new StringBuilder();
        if(locale.getLanguage().equals("vn")){
            sql.append("select ")
                .append("s.id, " )
                .append("s.code, " )
                .append("s.name, " )
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool levelShool, ")
                .append("p.pr_name_en provinceName, " )
                .append("d.dr_name_en districtName, " )
                .append("s.data_package_code  dataPackageCode, ")
                .append("s.status, ")
                .append("case when s.status = 0 then 'Khóa' else 'Hoạt động' end statusStr, ")
                .append("s.created_time createdTime, ")
                .append("dp.name dataPackageName, ")
                .append("ap.name levelSchoolName, ")
                .append("s.founded_date foundedDate, ")
                .append("s.founded_date foundDate, ")
                .append("s.email , " )
                .append("s.address, ")
                .append("s.principal , ")
                .append("s.phone_principal phonePrincipal, ")
                .append("s.website, ")
                .append("s.created_name, ")
                .append("s.contact, ")
                .append("s.district_id districtId, ")
                .append("s.hot_line hotLine, ")
                .append("s.logo, ")
                .append("ap2.name typeEducation, ")
                .append("s.password ")
                .append("from schools s left join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code ")
                .append("left join district d on s.district_id = d.dr_id  ")
                .append("left join ap_param ap2 on s.type_education = ap2.code  ")
                .append("where s.id = :id");
        }else if(locale.getLanguage().equals("la")){
            sql.append("select ")
                .append("s.id, " )
                .append("s.code, " )
                .append("s.name, " )
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool levelShool, ")
                .append("p.pr_name provinceName, " )
                .append("d.dr_name districtName, " )
                .append("s.data_package_code  dataPackageCode, ")
                .append("s.status, ")
                .append("case when s.status = 0 then 'Khóa' else 'Hoạt động' end statusStr, ")
                .append("s.created_time createdTime, ")
                .append("dp.name dataPackageName, ")
                .append("ap.name_la levelSchoolName, ")
                .append("s.founded_date foundedDate, ")
                .append("s.founded_date foundDate, ")
                .append("s.email , " )
                .append("s.address, ")
                .append("s.principal , ")
                .append("s.phone_principal phonePrincipal, ")
                .append("s.website, ")
                .append("s.created_name, ")
                .append("s.contact, ")
                .append("s.district_id districtId, ")
                .append("s.hot_line hotLine, ")
                .append("s.logo, ")
                .append("ap2.name_la typeEducation, ")
                .append("s.password ")
                .append("from schools s join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code ")
                .append("left join district d on s.district_id = d.dr_id  ")
                .append("left join ap_param ap2 on s.type_education = ap2.code  ")
                .append("where s.id = :id");
        }else{
            sql.append("select ")
                .append("s.id, " )
                .append("s.code, " )
                .append("s.name, " )
                .append("s.abbreviation_name as abbreviationName, ")
                .append("s.level_shool levelShool, ")
                .append("p.pr_name provinceName, " )
                .append("d.dr_name_en districtName, " )
                .append("s.data_package_code  dataPackageCode, ")
                .append("s.status, ")
                .append("case when s.status = 0 then 'Khóa' else 'Hoạt động' end statusStr, ")
                .append("s.created_time createdTime, ")
                .append("dp.name dataPackageName, ")
                .append("ap.name_en levelSchoolName, ")
                .append("s.founded_date foundedDate, ")
                .append("s.founded_date foundDate, ")
                .append("s.email , " )
                .append("s.address, ")
                .append("s.principal , ")
                .append("s.phone_principal phonePrincipal, ")
                .append("s.website, ")
                .append("s.created_name, ")
                .append("s.contact, ")
                .append("s.district_id districtId, ")
                .append("s.hot_line hotLine, ")
                .append("s.logo, ")
                .append("ap2.name_en typeEducation, ")
                .append("s.password ")
                .append("from schools s join province p on s.province_id = p.pr_id ")
                .append("left join data_packages dp on s.data_package_code = dp.code ")
                .append("left join ap_param ap on s.level_shool = ap.code ")
                .append("left join district d on s.district_id = d.dr_id  ")
                .append("left join ap_param ap2 on s.type_education = ap2.code  ")
                .append("where s.id = :id");
        }
        NativeQuery<SchoolDTO> query = ((Session) entityManager.getDelegate()).createNativeQuery(sql.toString());
        query.addScalar("id", new LongType()).addScalar("createdTime", new InstantType())
            .addScalar("name", new StringType()).addScalar("dataPackageCode", new StringType())
            .addScalar("code", new StringType()).addScalar("abbreviationName", new StringType())
            .addScalar("levelShool", new StringType()).addScalar("provinceName", new StringType())
            .addScalar("status", new LongType()).addScalar("dataPackageName", new StringType())
            .addScalar("levelSchoolName", new StringType()).addScalar("levelSchoolName", new StringType())
            .addScalar("statusStr", new StringType()).addScalar("foundedDate", new DateType())
            .addScalar("foundDate", new InstantType())
            .addScalar("email", new StringType()).addScalar("address", new StringType())
            .addScalar("principal", new StringType()).addScalar("phonePrincipal", new StringType())
            .addScalar("website", new StringType()).addScalar("contact", new StringType())
            .addScalar("districtId", new LongType()).addScalar("hotLine", new StringType())
            .addScalar("logo", new StringType()).addScalar("typeEducation", new StringType())
            .addScalar("password", new StringType()).addScalar("districtName", new StringType())
            .setResultTransformer(Transformers.aliasToBean(SchoolDTO.class));
        if(null != id){
            query.setParameter("id", id);
        }
        return query.uniqueResult();
    }

    @Override
    public List<SchoolDTO> findAllByProvinceId(Long id, Long status) {
        String sql =
            "select " +
                "s.id, " +
                "s.code, " +
                "s.name, " +
                "s.abbreviation_name as abbreviationName, " +
                "s.level_shool levelShool, " +
                "s.data_package_code  dataPackageCode, " +
                "s.status, " +
                "s.created_time createdTime, " +
                "ap.name levelSchoolName, " +
                "ap.name_la levelSchoolNameLA, " +
                "ap.name_en levelSchoolNameEN, " +
                "s.founded_date foundedDate, " +
                "s.email , " +
                "s.address, " +
                "s.principal , " +
                "s.phone_principal phonePrincipal, " +
                "s.website, " +
                "s.created_name, " +
                "s.contact, " +
                "s.district_id districtId, " +
                "s.hot_line hotLine, " +
                "s.logo, " +
                "s.type_education typeEducation, " +
                "s.password " +
                " FROM schools s " +
                " LEFT JOIN ap_param ap" +
                " ON s.level_shool = ap.code" +
                " WHERE ap.type='LEVEL_SCHOOL' " +
                " AND s.province_id = :provinceId " +
                " AND s.status = :status" +
                " ORDER BY ap.value, s.name";


        NativeQuery<SchoolDTO> query = ((Session) entityManager.getDelegate()).createNativeQuery(sql.toString());
        query.addScalar("id", new LongType()).addScalar("createdTime", new InstantType())
            .addScalar("name", new StringType()).addScalar("dataPackageCode", new StringType())
            .addScalar("code", new StringType()).addScalar("abbreviationName", new StringType())
            .addScalar("levelShool", new StringType()).addScalar("status", new LongType())
            .addScalar("levelSchoolName", new StringType()).addScalar("levelSchoolName", new StringType())
            .addScalar("levelSchoolNameLA", new StringType()).addScalar("levelSchoolNameLA", new StringType())
            .addScalar("levelSchoolNameEN", new StringType()).addScalar("levelSchoolNameEN", new StringType())
            .addScalar("foundedDate", new DateType()).addScalar("email", new StringType())
            .addScalar("address", new StringType()).addScalar("principal", new StringType())
            .addScalar("phonePrincipal", new StringType())
            .addScalar("website", new StringType()).addScalar("contact", new StringType())
            .addScalar("districtId", new LongType()).addScalar("hotLine", new StringType())
            .addScalar("logo", new StringType()).addScalar("typeEducation", new StringType())
            .addScalar("password", new StringType())
            .setResultTransformer(Transformers.aliasToBean(SchoolDTO.class));
        if(null != id)
            query.setParameter("provinceId", id);

        if(status != null)
            query.setParameter("status", status);


        return query.getResultList();
    }
}
