package com.laos.edu.repository.impl;

import com.laos.edu.repository.ProvinceCustomRepository;
import com.laos.edu.service.dto.ProvinceDTO;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@Repository
public class ProvinceCustomRepositoryImpl implements ProvinceCustomRepository {

    private EntityManager entityManager;
    public ProvinceCustomRepositoryImpl(EntityManager entityManager){
        this.entityManager = entityManager;
    }


    @Override
    public List<ProvinceDTO> getSchoolAndGroupByProvince(){
        String sql = "SELECT" +
            " COUNT(sc.id) numberOfSchoolPerProvince,prv.pr_id id, prv.pr_name prName, prv.pr_name_en prNameEn, prv.path pathSvg" +
            " FROM (select * from schools where status = 1) as sc" +
            " RIGHT JOIN province prv" +
            " ON sc.province_id = prv.pr_id " +
            " WHERE true" +
            " GROUP BY sc.province_id , prv.pr_name, prv.pr_name_en";

        Query query = entityManager.createNativeQuery(sql);
        query.unwrap(SQLQuery.class)
            .addScalar("id", new LongType())
            .addScalar("numberOfSchoolPerProvince", new LongType())
            .addScalar("prName", new StringType())
            .addScalar("prNameEn", new StringType())
            .addScalar("pathSvg", new StringType())
            .setResultTransformer(Transformers.aliasToBean(ProvinceDTO.class));

        return (List<ProvinceDTO>) query.getResultList();
    }
}
