package com.laos.edu.repository.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.commons.StringUtils;
import com.laos.edu.repository.DataPackageCustomRepository;
import com.laos.edu.service.dto.DataPackageDTO;
import com.laos.edu.service.dto.DataPackageEnum;
import com.laos.edu.service.dto.DataPackageResultDTO;
import com.laos.edu.service.dto.ManagementRegistrationDTO;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BigDecimalType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
@Repository
public class DataPackageCustomRepositoryImpl implements DataPackageCustomRepository {

    private final EntityManager entityManager;
    public DataPackageCustomRepositoryImpl(EntityManager entityManager){
        this.entityManager = entityManager;
    }
    @Override
    public List<DataPackageDTO> searchDataPackages(DataPackageDTO dataPackageDTO, Integer page, Integer pageSize) {
        StringBuilder sql = new StringBuilder("SELECT dp.id, dp.code,dp.name,dp.type_package typePackage," +
            " dp.primary_package primaryPackage, dp.level_school levelSchool, " +
            " dp.quantity_semester_apply quantitySemesterApply, dp.service service, " +
            " rs.prices prices,dp.quantity_sms quantitySms, dp.semester_apply semesterApply, ");

            if(dataPackageDTO.getLanguageType().equals(DataPackageEnum.VN.getValue()))
                sql.append(" ap.name as levelSchoolName, ");
            else if(dataPackageDTO.getLanguageType().equals(DataPackageEnum.EN.getValue()))
                sql.append(" ap.name_en as levelSchoolName, ");
            else
                sql.append(" ap.name_la as levelSchoolName, ");

            sql.append(" ap.code as levelSchoolCode, ap.value value" +
                " FROM data_packages as dp LEFT JOIN ap_param as ap" +
                " ON dp.level_school = ap.code" +
                " AND ap.type = 'LEVEL_SCHOOL' " +
                " LEFT JOIN ( " +
                " SELECT rs.apply_date as applyDate,rs.package_code, rs.prices from package_price as rs" +
                " RIGHT JOIN " +
                " (SELECT pp.prices, pp.package_code, max(apply_date) as maxDate" +
                " FROM package_price  AS pp " +
                " GROUP BY pp.package_code) as kq " +
                " ON rs.package_code = kq.package_code " +
                " GROUP BY rs.package_code"+
                ") as rs ON rs.package_code = dp.code WHERE true");

            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getCode())){
                sql.append(" and upper(dp.code) LIKE upper(:code) escape '&' ");
            }
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getName())){
                sql.append(" and upper(dp.name) LIKE upper(:name) escape '&' ");
            }
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getLevelSchool())){
                    //sql.append(" and dp.level_school LIKE (:levelSchool)");
                sql.append(" and dp.id IN (select t.id " +
                            " from data_packages t " +
                            " join json_table( " +
                            "  replace(json_array(t.level_school), ',', '\",\"')," +
                            " '$[*]' columns (level_school varchar(1000) path '$') " +
                            " ) j where j.level_school = :levelSchool )");
            }
        sql.append(" order by dp.name,dp.code");
        if(page != 0 & pageSize != 0){
            int offset;
            if (page <= 1) {
                offset = 0;
            }else{
                offset = (page - 1) * pageSize;
            }
            sql.append(" limit "+ offset + "," + pageSize + " ");
        }
        Query query = entityManager.createNativeQuery(sql.toString());

        if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getCode()))
            query.setParameter("code","%"+validateKeySearch(dataPackageDTO.getCode())+"%");
        if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getName()))
            query.setParameter("name", "%"+ validateKeySearch(dataPackageDTO.getName()) +"%");
        if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getLevelSchool()))
            query.setParameter("levelSchool", dataPackageDTO.getLevelSchool());

        query.unwrap(SQLQuery.class)
            .addScalar("id", new LongType())
            .addScalar("code", new StringType())
            .addScalar("name", new StringType())
            .addScalar("typePackage", new LongType())
            .addScalar("primaryPackage", new StringType())
            .addScalar("levelSchool", new StringType())
            .addScalar("quantitySemesterApply", new LongType())
            .addScalar("prices", new BigDecimalType())
            .addScalar("quantitySms", new LongType())
            .addScalar("semesterApply", new StringType())
            .addScalar("levelSchoolName", new StringType())
            .addScalar("levelSchoolCode", new StringType())
            .addScalar("service",new StringType())
            .setResultTransformer(Transformers.aliasToBean(DataPackageDTO.class));
       List<DataPackageDTO> resultList = query.getResultList();
       return resultList;
    }

    @Override
    public BigInteger getTotalRecords(DataPackageDTO dataPackageDTO) {
        StringBuilder sql = new StringBuilder("Select count(dp.id) from data_packages dp where true ");
        if(dataPackageDTO != null){
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getCode())){
                sql.append(" and upper(dp.code) LIKE upper(:code) escape '&' ");
            }
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getName())){
                sql.append(" and upper(dp.name) LIKE upper(:name) escape '&' ");
            }
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getLevelSchool())){
                sql.append(" and dp.id IN (select t.id " +
                    " from data_packages t " +
                    " join json_table( " +
                    "  replace(json_array(t.level_school), ',', '\",\"')," +
                    " '$[*]' columns (level_school varchar(1000) path '$') " +
                    " ) j where j.level_school = :levelSchool )");
            }
        }

        NativeQuery query = ((Session) entityManager.getDelegate()).createNativeQuery(sql.toString());

        if(dataPackageDTO != null){
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getCode()))
                query.setParameter("code", "%"+ validateKeySearch(dataPackageDTO.getCode())+"%" );
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getLevelSchool()))
                query.setParameter("levelSchool", dataPackageDTO.getLevelSchool());
            if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getName())){
                query.setParameter("name", "%"+ validateKeySearch(dataPackageDTO.getName()) +"%");
            }
        }
        return (BigInteger) query.uniqueResult();
    }


    public DataPackageDTO findByLevelSchool(DataPackageDTO dataPackageDTO,String levelSchool){
        StringBuilder sql = new StringBuilder("SELECT ap.code, ");
        if(dataPackageDTO.getLanguageType().equals(DataPackageEnum.VN.getValue()))
            sql.append(" ap.name ");
        else if(dataPackageDTO.getLanguageType().equals(DataPackageEnum.EN.getValue()))
            sql.append(" ap.name_en ");
        else
            sql.append(" ap.name_la ");
        sql.append(" FROM ap_param AS ap  WHERE ap.code = :levelSchool ");

        Query query = entityManager.createNativeQuery(sql.toString());
        if(StringUtils.isNotNullOrEmpty(levelSchool)){
            query.setParameter("levelSchool",levelSchool);
        }
        Object[] result = (Object[]) query.getSingleResult();
        DataPackageDTO dto = new DataPackageDTO();
        dto.setLevelSchoolName(DataUtil.safeToString(result[1]));
        return dto;
    }

    public DataPackageDTO findByService(DataPackageDTO dataPackageDTO,String service){
        StringBuilder sql = new StringBuilder("SELECT ap.code, ");
        if(dataPackageDTO.getLanguageType().equals(DataPackageEnum.VN.getValue()))
            sql.append(" ap.name ");
        else if(dataPackageDTO.getLanguageType().equals(DataPackageEnum.EN.getValue()))
            sql.append(" ap.name_en ");
        else
            sql.append(" ap.name_la ");
        sql.append(" FROM ap_param AS ap  WHERE ap.code = :service ");

        Query query = entityManager.createNativeQuery(sql.toString());
        if(StringUtils.isNotNullOrEmpty(service)){
            query.setParameter("service",service);
        }
        Object[] result = (Object[]) query.getSingleResult();
        DataPackageDTO dto = new DataPackageDTO();
        dto.setServiceName(DataUtil.safeToString(result[1]));
        return dto;
    }

    @Override
    @Transactional
    public void savePackagePrice(DataPackageDTO dataPackageDTO) {
        String sql = "insert into package_price(package_code,apply_date,prices) VALUES(?,?,?)";
        Query query = ((Session) entityManager.getDelegate()).createNativeQuery(sql);
        query.setParameter(1,dataPackageDTO.getCode())
             .setParameter(2,dataPackageDTO.getCreatedTime())
             .setParameter(3,dataPackageDTO.getPrices())
             .executeUpdate();

    }

    @Override
    public boolean checkDependency(DataPackageDTO dataPackageDTO) {
        String sql =
            " SELECT dp1.code from data_packages as dp1" +
            " INNER JOIN data_packages as dp2" +
            " ON dp1.code = dp2.primary_package" +
            " WHERE dp1.code = :code" ;
        return checkCondition(sql, dataPackageDTO);
    }

    @Override
    public boolean checkAlreadyAssignForSchool(DataPackageDTO dataPackageDTO) {
        String sql =
            " SELECT sc.data_package_code from data_packages as dp1" +
            " INNER JOIN schools as sc " +
            " ON dp1.code = sc.data_package_code" +
            " WHERE dp1.code=:code";
        return checkCondition(sql, dataPackageDTO);
    }

    @Override
    public boolean checkSupportPackageHavePrimaryPackageAssignedBySchool(DataPackageDTO dataPackageDTO) {
        String sql =
            " SELECT dp1.primary_package from data_packages as dp1 " +
                " INNER JOIN schools as sc " +
                " ON dp1.primary_package = sc.data_package_code " +
                " WHERE dp1.code=:code";
        return checkCondition(sql, dataPackageDTO);

    }

    @Override
    public boolean checkSupportPackageIsAssignedByPrimaryPackage(DataPackageDTO dataPackageDTO) {
        String sql = "SELECT dp.code as Code from data_packages as dp" +
            "    INNER JOIN schools as sc" +
            "    ON sc.data_package_code = dp.code" +
            "    WHERE dp.primary_package = :code ";
        return checkCondition(sql,dataPackageDTO);
    }


    @Override
    public List<DataPackageDTO> findPrimaryPackageBySupportPackage(DataPackageDTO dataPackageDTO) {
        StringBuilder sql = new StringBuilder("");
            sql.append("SELECT" +
                " dp1.quantity_semester_apply as quantitySemesterApply," +
                " dp1.semester_apply as semesterApply," +
                " dp1.primary_package as primaryPackage from data_packages as dp1 "+
                " WHERE true");
        if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getCode())){
            sql.append(" and upper(dp1.primary_package) = upper(:code)");
        }
        if(dataPackageDTO.getId() != null){
            sql.append(" and dp1.id != :id");
        }
        Query query = entityManager.createNativeQuery(sql.toString());
        if(StringUtils.isNotNullOrEmpty(dataPackageDTO.getPrimaryPackage()))
            query.setParameter("code",  dataPackageDTO.getPrimaryPackage());
        if(dataPackageDTO.getId() != null)
            query.setParameter("id",  dataPackageDTO.getId());
        query.unwrap(SQLQuery.class)
            .addScalar("quantitySemesterApply",new LongType())
            .addScalar("semesterApply", new StringType())
            .addScalar("primaryPackage", new StringType())
            .setResultTransformer(Transformers.aliasToBean(DataPackageDTO.class));
        List<DataPackageDTO> resultList = query.getResultList();
        return resultList;
    }

    @Override
    public List<DataPackageDTO> getAllByLevelSchool(String levelSchool) {
        StringBuilder sql = new StringBuilder("SELECT dp.id, dp.code,dp.name,dp.type_package typePackage," +
            " dp.primary_package primaryPackage, dp.level_school levelSchool, " +
            " dp.quantity_semester_apply quantitySemesterApply, " +
            " rs.prices prices,dp.quantity_sms quantitySms, dp.semester_apply semesterApply, " +
            " ap.name as levelSchoolName, ap.code as levelSchoolCode, ap.value value" +
            " FROM data_packages as dp LEFT JOIN ap_param as ap" +
            " ON dp.level_school = ap.code" +
            " AND ap.type = 'LEVEL_SCHOOL' " +
            " LEFT JOIN ( " +
            " SELECT rs.apply_date as applyDate,rs.package_code, rs.prices from package_price as rs" +
            " RIGHT JOIN " +
            " (SELECT pp.prices, pp.package_code, max(apply_date) as maxDate" +
            " FROM package_price  AS pp " +
            " GROUP BY pp.package_code) as kq " +
            " ON rs.package_code = kq.package_code " +
            " GROUP BY rs.package_code" +
            ") as rs ON rs.package_code = dp.code WHERE true and dp.type_package = 1");

        if (StringUtils.isNotNullOrEmpty(levelSchool)) {
            sql.append(" and dp.id IN (select t.id " +
                " from data_packages t " +
                " join json_table( " +
                "  replace(json_array(t.level_school), ',', '\",\"')," +
                " '$[*]' columns (level_school varchar(1000) path '$') " +
                " ) j where j.level_school = :levelSchool )");
        }
        Query query = entityManager.createNativeQuery(sql.toString());

        if (StringUtils.isNotNullOrEmpty(levelSchool))
            query.setParameter("levelSchool", levelSchool);

        query.unwrap(SQLQuery.class)
            .addScalar("id", new LongType())
            .addScalar("code", new StringType())
            .addScalar("name", new StringType())
            .addScalar("typePackage", new LongType())
            .addScalar("primaryPackage", new StringType())
            .addScalar("levelSchool", new StringType())
            .addScalar("quantitySemesterApply", new LongType())
            .addScalar("prices", new BigDecimalType())
            .addScalar("quantitySms", new LongType())
            .addScalar("semesterApply", new StringType())
            .addScalar("levelSchoolName", new StringType())
            .addScalar("levelSchoolCode", new StringType())
            .setResultTransformer(Transformers.aliasToBean(DataPackageDTO.class));
        List<DataPackageDTO> resultList = query.getResultList();
        return resultList;
    }
//    @Override
//    public boolean checkAlreadyAssignForSchoolUpdate(DataPackageDTO dataPackageDTO) {
//        String sql  = "";
//        return checkCondition(sql, dataPackageDTO);
//    }

    private boolean checkCondition(String sql, DataPackageDTO dataPackageDTO){
        Query query = entityManager.createNativeQuery(sql)
            .setParameter("code",dataPackageDTO.getCode());
        List<Object[]> resultList = query.getResultList();
        int size = resultList.size();
        boolean isCheck = false;
        if(size > 0){
            isCheck = true;
        }
        return !isCheck;
    }

    public static String validateKeySearch(String str){
        return str.replaceAll("&", "&&").replaceAll("%","&%").replaceAll("_", "&_");
    }

}
