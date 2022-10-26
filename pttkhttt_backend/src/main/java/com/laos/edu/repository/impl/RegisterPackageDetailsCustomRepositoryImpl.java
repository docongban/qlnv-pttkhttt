package com.laos.edu.repository.impl;

import com.laos.edu.commons.DataUtil;
import com.laos.edu.repository.RegisterPackageDetailsCustomRepository;
import com.laos.edu.service.dto.RegisterPackageDetailsDTO;
import com.laos.edu.service.dto.RegisterReportDTO;
import liquibase.pro.packaged.co;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RegisterPackageDetailsCustomRepositoryImpl implements RegisterPackageDetailsCustomRepository {

    @Autowired
    private EntityManager entityManager;



    @Override
    public RegisterReportDTO getData(RegisterPackageDetailsDTO registerPackageDetailsDTO) {
        RegisterReportDTO registerReportDTO = new RegisterReportDTO();
        List<RegisterReportDTO> lst = new ArrayList<>();
        String sqlStatis = "select \n" +
                "                                                count_begin,\n" +
                "                                                count_begin_register,\n" +
                "                                                count_begin_cancel,\n" +
                "                                                count_current,\n" +
                "                                                count_current_register,\n" +
                "                                                count_current_cancel,\n" +
                "                                                (count_begin_register+count_current_register)-(count_begin_cancel+count_current_cancel) sl_dang_hoat_dong_cuoi_ky,\n" +
                "                                                case when count_begin = 0 then '-' \n" +
                "                                                when count_begin > 0 then ((((count_begin_register+count_current_register)-(count_begin_cancel+count_current_cancel))/count_begin_register)-1)*100  end ti_le_tang_truong_nguoi_dung,\n" +
                "                                                IFNULL(sum_begin_prince,0) sum_begin_prince,\n" +
                "                                                IFNULL(sum_current_prince,0) sum_current_prince,\n" +
                "                                                IFNULL(sum_begin_prince,0)+IFNULL(sum_current_prince,0) doanh_thu_cuoi_ky,\n" +
                "                                                case when IFNULL(sum_begin_prince,0) = 0 then '-' \n" +
                "                                                     when IFNULL(sum_begin_prince,0) > 0 then (((IFNULL(sum_begin_prince,0)+IFNULL(sum_current_prince,0))/IFNULL(sum_begin_prince,0))-1)*100 end ti_le_tang_truong_doanh_thu\n" +
                "                                                FROM\n" +
                "                                                (select count(*)count_begin from register_package_details where create_date <= concat(:toDateBegin,' 23:59:59')) be,\n" +
                "                                                (select count(*)count_begin_register from register_package_details where create_date <= concat(:toDateBegin,' 23:59:59') and `action`  = 1)begin_register,\n" +
                "                                                (select count(*)count_begin_cancel from register_package_details where create_date <= concat(:toDateBegin,' 23:59:59') and `action` in (0,2))begin_cancel,\n" +
                "                                                (select count(*) count_current from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= concat(:toDateCurrent,' 23:59:59'))cur,\n" +
                "                                                (select count(*) count_current_register from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= concat(:toDateCurrent,' 23:59:59') and `action` = 1) cur_register,\n" +
                "                                                (select count(*) count_current_cancel from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= concat(:toDateCurrent,' 23:59:59') and `action` in(0,2)) cur_cancel,\n" +
                "                                                (select\n" +
                "                            sum(price) sum_begin_prince\n" +
                "                            from\n" +
                "                            (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date <= concat(:toDateBegin,' 23:59:59') and apply_date <= concat(:toDateBegin,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= concat(:toDateBegin,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                            )a) sum_beg_pri,\n" +
                "                                                (select\n" +
                "                            sum(price) sum_current_prince\n" +
                "                            from\n" +
                "                            (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date >= :fromDateCurrent and create_date <= concat(:toDateCurrent,' 23:59:59') and apply_date <= concat(:toDateCurrent,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= concat(:toDateCurrent,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                            )a) sum_current_pri ";

        Query queryStatis = entityManager.createNativeQuery(sqlStatis);
        queryStatis.setParameter("toDateBegin", registerPackageDetailsDTO.getToDateBegin());
        queryStatis.setParameter("fromDateCurrent", registerPackageDetailsDTO.getFromDateCurrent());
        queryStatis.setParameter("toDateCurrent", registerPackageDetailsDTO.getToDateCurrent());

        List<Object[]> lstStatis = queryStatis.getResultList();
        RegisterPackageDetailsDTO resultRegisterPackageDetailsDTO = new RegisterPackageDetailsDTO();
        for(Object[] obj : lstStatis){
            resultRegisterPackageDetailsDTO.setCountBegin(DataUtil.safeToLong(obj[0]));
            resultRegisterPackageDetailsDTO.setCountBeginRegister(DataUtil.safeToLong(obj[1]));
            resultRegisterPackageDetailsDTO.setCountBeginCancel(DataUtil.safeToLong(obj[2]));
            resultRegisterPackageDetailsDTO.setCountCurrent(DataUtil.safeToLong(obj[3]));
            resultRegisterPackageDetailsDTO.setCountCurrentRegister(DataUtil.safeToLong(obj[4]));
            resultRegisterPackageDetailsDTO.setCountCurrentCancel(DataUtil.safeToLong(obj[5]));
            resultRegisterPackageDetailsDTO.setCountActiveEnd(DataUtil.safeToDouble(obj[6]));
            resultRegisterPackageDetailsDTO.setRatioGrowthUser(DataUtil.safeToString(obj[7]));
            resultRegisterPackageDetailsDTO.setSumBeginPrice(DataUtil.safeToDouble(obj[8]));
            resultRegisterPackageDetailsDTO.setSumCurrentPrice(DataUtil.safeToDouble(obj[9]));
            resultRegisterPackageDetailsDTO.setSumPriceEnd(DataUtil.safeToDouble(obj[10]));
            resultRegisterPackageDetailsDTO.setRatioGrowthPrice(DataUtil.safeToString(obj[11]));
        }
        registerReportDTO.setDataStatistical(resultRegisterPackageDetailsDTO);

        String sql = "select \n" +
                "                                                dp.code ,\n" +
                "                                                dp.name,\n" +
                "                                                IFNULL(register_begin.cout,0) register_begin,\n" +
                "                                                IFNULL(cancel_begin.cout,0) cancel_begin,\n" +
                "                                                IFNULL(price_begin.sum_begin_price,0) price_begin,\n" +
                "                                                IFNULL(register_current.cout,0) register_current, \n" +
                "                                                IFNULL(cancel_current.cout,0) cancel_current,\n" +
                "                                                IFNULL(price_current.sum_current_price,0) price_current,\n" +
                "                                                IFNULL(register_begin.cout,0)+IFNULL(register_current.cout,0) register_end,\n" +
                "                                                IFNULL(cancel_begin.cout,0)+IFNULL(cancel_current.cout,0) cancel_end,\n" +
                "                                                (IFNULL(register_begin.cout,0)+IFNULL(register_current.cout,0))-(IFNULL(cancel_begin.cout,0)+IFNULL(cancel_current.cout,0)) active_end,\n" +
                "                                                IFNULL(price_begin.sum_begin_price,0)+IFNULL(price_current.sum_current_price,0) price_end,\n" +
                "                                                case when IFNULL(register_begin.cout,0) = 0 then '-' \n" +
                "                                                     when IFNULL(register_begin.cout,0) > 0 then ((((IFNULL(register_begin.cout,0)+IFNULL(register_current.cout,0))-(IFNULL(cancel_begin.cout,0)+IFNULL(cancel_current.cout,0)))/IFNULL(register_begin.cout,0))-1)*100 end users,\n" +
                "                                                case when IFNULL(price_begin.sum_begin_price,0) = 0 then '-'\n" +
                "                                                     when IFNULL(price_begin.sum_begin_price,0) > 0 then (((IFNULL(price_begin.sum_begin_price,0)+IFNULL(price_current.sum_current_price,0))/IFNULL(price_begin.sum_begin_price,0))-1)*100 end price,\n" +
                "                                                IFNULL(price_month_1_begin.price,0)+IFNULL(price_month_1.price,0) price_month_1,\n" +
                "                                                IFNULL(price_month_2_begin.price,0)+IFNULL(price_month_2.price,0) price_month_2,\n" +
                "                                                IFNULL(price_month_3_begin.price,0)+IFNULL(price_month_3.price,0) price_month_3,\n" +
                "                                                IFNULL(price_month_4_begin.price,0)+IFNULL(price_month_4.price,0) price_month_4,\n" +
                "                                                IFNULL(price_month_5_begin.price,0)+IFNULL(price_month_5.price,0) price_month_5,\n" +
                "                                                IFNULL(price_month_6_begin.price,0)+IFNULL(price_month_6.price,0) price_month_6,\n" +
                "                                                IFNULL(price_month_7_begin.price,0)+IFNULL(price_month_7.price,0) price_month_7,\n" +
                "                                                IFNULL(price_month_8_begin.price,0)+IFNULL(price_month_8.price,0) price_month_8,\n" +
                "                                                IFNULL(price_month_9_begin.price,0)+IFNULL(price_month_9.price,0) price_month_9,\n" +
                "                                                IFNULL(price_month_10_begin.price,0)+IFNULL(price_month_10.price,0) price_month_10,\n" +
                "                                                IFNULL(price_month_11_begin.price,0)+IFNULL(price_month_11.price,0) price_month_11,\n" +
                "                                                IFNULL(price_month_12_begin.price,0)+IFNULL(price_month_11.price,0) price_month_12\n" +
                "                                                from  data_packages dp\n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` = 1 and create_date <= CONCAT(:toDateBegin,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) register_begin on register_begin.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` in (0,2) and create_date <= CONCAT(:toDateBegin,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) cancel_begin on cancel_begin.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) sum_begin_price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date <= CONCAT(:toDateBegin,' 23:59:59') and apply_date <= CONCAT(:toDateBegin,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= CONCAT(:toDateBegin,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_begin on price_begin.data_package = dp.code\n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` = 1 and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) register_current on register_current.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` in (0,2) and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) cancel_current on cancel_current.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) sum_current_price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59') and apply_date <= CONCAT(:toDateCurrent,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= CONCAT(:toDateCurrent,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                                ) price_current on price_current.data_package = dp.code\n" +
                "                               left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-01-01') and apply_date < CONCAT(:year,'-01-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-01-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_1_begin on price_month_1_begin.data_package = dp.code\n" +
                "                               left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-01-01') and create_date < concat(:year,'-02-01') and apply_date < CONCAT(:year,'-02-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-02-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_1 on price_month_1.data_package = dp.code\n" +
                "                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-02-01') and create_date < concat(:year,'-02-01') and apply_date < CONCAT(:year,'-03-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-02-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_2_begin on price_month_2_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-02-01') and create_date < concat(:year,'-03-01') and apply_date < CONCAT(:year,'-03-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-03-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_2 on price_month_2.data_package = dp.code\n" +
                "                left join \n" +
                "                                     (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-03-01') and apply_date < CONCAT(:year,'-03-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-03-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_3_begin on price_month_3_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                     (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-03-01') and create_date < concat(:year,'-04-01') and apply_date < CONCAT(:year,'-04-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-04-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_3 on price_month_3.data_package = dp.code\n" +
                "                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-04-01') and apply_date < CONCAT(:year,'-04-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-04-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_4_begin on price_month_4_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-04-01') and create_date < concat(:year,'-05-01') and apply_date < CONCAT(:year,'-05-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-05-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_4 on price_month_4.data_package = dp.code \n" +
                "                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-05-01') and apply_date < CONCAT(:year,'-05-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a\n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-05-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_5_begin on price_month_5_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-05-01') and create_date < concat(:year,'-06-01') and apply_date < CONCAT(:year,'-06-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-06-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_5 on price_month_5.data_package = dp.code \n" +
                "                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-06-01') and apply_date < CONCAT(:year,'-06-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-06-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_6_begin on price_month_6_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-06-01') and create_date < concat(:year,'-07-01') and apply_date < CONCAT(:year,'-07-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-07-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_6 on price_month_6.data_package = dp.code \n" +
                "                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-07-01')  and apply_date < CONCAT(:year,'-07-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-07-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_7_begin on price_month_7_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package\n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-07-01') and create_date < concat(:year,'-08-01') and apply_date < CONCAT(:year,'-08-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-08-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_7 on price_month_7.data_package = dp.code\n" +
                "                left join \n" +
                "                                 (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-08-01')  and apply_date < CONCAT(:year,'-08-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-08-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_8_begin on price_month_8_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                 (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-08-01') and create_date < concat(:year,'-09-01') and apply_date < CONCAT(:year,'-09-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-09-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_8 on price_month_8.data_package = dp.code \n" +
                "                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-09-01') and apply_date < CONCAT(:year,'-09-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-09-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_9_begin on price_month_9_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-09-01') and create_date < concat(:year,'-10-01') and apply_date < CONCAT(:year,'-10-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-10-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_9 on price_month_9.data_package = dp.code \n" +
                "                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-10-01') and apply_date < CONCAT(:year,'-10-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-10-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_10_begin on price_month_10_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-10-01') and create_date < concat(:year,'-11-01') and apply_date < CONCAT(:year,'-11-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-11-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_10 on price_month_10.data_package = dp.code \n" +
                "                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-11-01') and apply_date < CONCAT(:year,'-11-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-11-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_11_begin on price_month_11_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-11-01') and create_date < concat(:year,'-12-01') and apply_date < CONCAT(:year,'-12-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-12-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_11 on price_month_11.data_package = dp.code \n" +
                "                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-12-01') and apply_date < CONCAT(:year,'-12-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-12-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_12_begin on price_month_12_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-12-01') and create_date <= concat(:year,'-12-31') and apply_date <= CONCAT(:year,'-12-31') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= CONCAT(:year,'-12-31')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_12 on price_month_12.data_package = dp.code \n" +
                "                order by dp.name asc ";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("toDateBegin", registerPackageDetailsDTO.getToDateBegin());
        query.setParameter("fromDateCurrent", registerPackageDetailsDTO.getFromDateCurrent());
        query.setParameter("toDateCurrent", registerPackageDetailsDTO.getToDateCurrent());
        query.setParameter("year",registerPackageDetailsDTO.getYear());
        List<Object[]> lstQuery = query.getResultList();
        List<RegisterPackageDetailsDTO> lstTable = new ArrayList<>();
        for(Object[] obj: lstQuery) {
            RegisterPackageDetailsDTO dto = new RegisterPackageDetailsDTO();
            dto.setDataPackage(DataUtil.safeToString(obj[0]));
            dto.setDataPackageName(DataUtil.safeToString(obj[1]));
            dto.setRegisterBegin(DataUtil.safeToLong(obj[2]));
            dto.setCancelBegin(DataUtil.safeToLong(obj[3]));
            dto.setSumBeginPrice(DataUtil.safeToDouble(obj[4]));
            dto.setRegisterCurrent(DataUtil.safeToLong(obj[5]));
            dto.setCancelCurrent(DataUtil.safeToLong(obj[6]));
            dto.setSumCurrentPrice(DataUtil.safeToDouble(obj[7]));
            dto.setRegisterEnd(DataUtil.safeToLong(obj[8]));
            dto.setCancelEnd(DataUtil.safeToLong(obj[9]));
            dto.setCountActiveEnd(DataUtil.safeToDouble(obj[10]));
            dto.setSumPriceEnd(DataUtil.safeToDouble(obj[11]));
            dto.setRatioGrowthUser(DataUtil.safeToString(obj[12]));
            dto.setRatioGrowthPrice(DataUtil.safeToString(obj[13]));
            dto.setPriceMonth1(DataUtil.safeToDouble(obj[14]));
            dto.setPriceMonth2(DataUtil.safeToDouble(obj[15]));
            dto.setPriceMonth3(DataUtil.safeToDouble(obj[16]));
            dto.setPriceMonth4(DataUtil.safeToDouble(obj[17]));
            dto.setPriceMonth5(DataUtil.safeToDouble(obj[18]));
            dto.setPriceMonth6(DataUtil.safeToDouble(obj[19]));
            dto.setPriceMonth7(DataUtil.safeToDouble(obj[20]));
            dto.setPriceMonth8(DataUtil.safeToDouble(obj[21]));
            dto.setPriceMonth9(DataUtil.safeToDouble(obj[22]));
            dto.setPriceMonth10(DataUtil.safeToDouble(obj[23]));
            dto.setPriceMonth11(DataUtil.safeToDouble(obj[24]));
            dto.setPriceMonth12(DataUtil.safeToDouble(obj[25]));
            lstTable.add(dto);
        }
        registerReportDTO.setData(lstTable);
        return registerReportDTO;
    }

    @Override
    public RegisterPackageDetailsDTO getStatistical(RegisterPackageDetailsDTO registerPackageDetailsDTO) {
//        List<RegisterReportDTO> lst = new ArrayList<>();
        String sqlStatis = "select \n" +
                "                                                count_begin,\n" +
                "                                                count_begin_register,\n" +
                "                                                count_begin_cancel,\n" +
                "                                                count_current,\n" +
                "                                                count_current_register,\n" +
                "                                                count_current_cancel,\n" +
                "                                                (count_begin_register+count_current_register)-(count_begin_cancel+count_current_cancel) sl_dang_hoat_dong_cuoi_ky,\n" +
                "                                                case when count_begin = 0 then '-' \n" +
                "                                                when count_begin > 0 then ((((count_begin_register+count_current_register)-(count_begin_cancel+count_current_cancel))/count_begin_register)-1)*100  end ti_le_tang_truong_nguoi_dung,\n" +
                "                                                IFNULL(sum_begin_prince,0) sum_begin_prince,\n" +
                "                                                IFNULL(sum_current_prince,0) sum_current_prince,\n" +
                "                                                IFNULL(sum_begin_prince,0)+IFNULL(sum_current_prince,0) doanh_thu_cuoi_ky,\n" +
                "                                                case when IFNULL(sum_begin_prince,0) = 0 then '-' \n" +
                "                                                     when IFNULL(sum_begin_prince,0) > 0 then (((IFNULL(sum_begin_prince,0)+IFNULL(sum_current_prince,0))/IFNULL(sum_begin_prince,0))-1)*100 end ti_le_tang_truong_doanh_thu\n" +
                "                                                FROM\n" +
                "                                                (select count(*)count_begin from register_package_details where create_date <= concat(:toDateBegin,' 23:59:59')) be,\n" +
                "                                                (select count(*)count_begin_register from register_package_details where create_date <= concat(:toDateBegin,' 23:59:59') and `action`  = 1)begin_register,\n" +
                "                                                (select count(*)count_begin_cancel from register_package_details where create_date <= concat(:toDateBegin,' 23:59:59') and `action` in (0,2))begin_cancel,\n" +
                "                                                (select count(*) count_current from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= concat(:toDateCurrent,' 23:59:59'))cur,\n" +
                "                                                (select count(*) count_current_register from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= concat(:toDateCurrent,' 23:59:59') and `action` = 1) cur_register,\n" +
                "                                                (select count(*) count_current_cancel from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= concat(:toDateCurrent,' 23:59:59') and `action` in(0,2)) cur_cancel,\n" +
                "                                                (select\n" +
                "                            sum(price) sum_begin_prince\n" +
                "                            from\n" +
                "                            (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date <= concat(:toDateBegin,' 23:59:59') and apply_date <= concat(:toDateBegin,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= concat(:toDateBegin,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                            )a) sum_beg_pri,\n" +
                "                                                (select\n" +
                "                            sum(price) sum_current_prince\n" +
                "                            from\n" +
                "                            (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date >= :fromDateCurrent and create_date <= concat(:toDateCurrent,' 23:59:59') and apply_date <= concat(:toDateCurrent,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= concat(:toDateCurrent,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                            )a) sum_current_pri ";

        Query queryStatis = entityManager.createNativeQuery(sqlStatis);
        queryStatis.setParameter("toDateBegin", registerPackageDetailsDTO.getToDateBegin());
        queryStatis.setParameter("fromDateCurrent", registerPackageDetailsDTO.getFromDateCurrent());
        queryStatis.setParameter("toDateCurrent", registerPackageDetailsDTO.getToDateCurrent());

        List<Object[]> lstStatis = queryStatis.getResultList();
        RegisterPackageDetailsDTO resultRegisterPackageDetailsDTO = new RegisterPackageDetailsDTO();
        for(Object[] obj : lstStatis){
            resultRegisterPackageDetailsDTO.setCountBegin(DataUtil.safeToLong(obj[0]));
            resultRegisterPackageDetailsDTO.setCountBeginRegister(DataUtil.safeToLong(obj[1]));
            resultRegisterPackageDetailsDTO.setCountBeginCancel(DataUtil.safeToLong(obj[2]));
            resultRegisterPackageDetailsDTO.setCountCurrent(DataUtil.safeToLong(obj[3]));
            resultRegisterPackageDetailsDTO.setCountCurrentRegister(DataUtil.safeToLong(obj[4]));
            resultRegisterPackageDetailsDTO.setCountCurrentCancel(DataUtil.safeToLong(obj[5]));
            resultRegisterPackageDetailsDTO.setCountActiveEnd(DataUtil.safeToDouble(obj[6]));
            resultRegisterPackageDetailsDTO.setRatioGrowthUser(DataUtil.safeToString(obj[7]));
            resultRegisterPackageDetailsDTO.setSumBeginPrice(DataUtil.safeToDouble(obj[8]));
            resultRegisterPackageDetailsDTO.setSumCurrentPrice(DataUtil.safeToDouble(obj[9]));
            resultRegisterPackageDetailsDTO.setSumPriceEnd(DataUtil.safeToDouble(obj[10]));
            resultRegisterPackageDetailsDTO.setRatioGrowthPrice(DataUtil.safeToString(obj[11]));
        }
        return resultRegisterPackageDetailsDTO;
    }

    @Override
    public Page<RegisterPackageDetailsDTO> getDetailsData(RegisterPackageDetailsDTO registerPackageDetailsDTO, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String sql = "select \n" +
                "                                                dp.code ,\n" +
                "                                                dp.name,\n" +
                "                                                IFNULL(register_begin.cout,0) register_begin,\n" +
                "                                                IFNULL(cancel_begin.cout,0) cancel_begin,\n" +
                "                                                IFNULL(price_begin.sum_begin_price,0) price_begin,\n" +
                "                                                IFNULL(register_current.cout,0) register_current, \n" +
                "                                                IFNULL(cancel_current.cout,0) cancel_current,\n" +
                "                                                IFNULL(price_current.sum_current_price,0) price_current,\n" +
                "                                                IFNULL(register_begin.cout,0)+IFNULL(register_current.cout,0) register_end,\n" +
                "                                                IFNULL(cancel_begin.cout,0)+IFNULL(cancel_current.cout,0) cancel_end,\n" +
                "                                                (IFNULL(register_begin.cout,0)+IFNULL(register_current.cout,0))-(IFNULL(cancel_begin.cout,0)+IFNULL(cancel_current.cout,0)) active_end,\n" +
                "                                                IFNULL(price_begin.sum_begin_price,0)+IFNULL(price_current.sum_current_price,0) price_end,\n" +
                "                                                case when IFNULL(register_begin.cout,0) = 0 then '-' \n" +
                "                                                     when IFNULL(register_begin.cout,0) > 0 then ((((IFNULL(register_begin.cout,0)+IFNULL(register_current.cout,0))-(IFNULL(cancel_begin.cout,0)+IFNULL(cancel_current.cout,0)))/IFNULL(register_begin.cout,0))-1)*100 end users,\n" +
                "                                                case when IFNULL(price_begin.sum_begin_price,0) = 0 then '-'\n" +
                "                                                     when IFNULL(price_begin.sum_begin_price,0) > 0 then (((IFNULL(price_begin.sum_begin_price,0)+IFNULL(price_current.sum_current_price,0))/IFNULL(price_begin.sum_begin_price,0))-1)*100 end price,\n" +
                "                                                IFNULL(price_month_1_begin.price,0)+IFNULL(price_month_1.price,0) price_month_1,\n" +
                "                                                IFNULL(price_month_2_begin.price,0)+IFNULL(price_month_2.price,0) price_month_2,\n" +
                "                                                IFNULL(price_month_3_begin.price,0)+IFNULL(price_month_3.price,0) price_month_3,\n" +
                "                                                IFNULL(price_month_4_begin.price,0)+IFNULL(price_month_4.price,0) price_month_4,\n" +
                "                                                IFNULL(price_month_5_begin.price,0)+IFNULL(price_month_5.price,0) price_month_5,\n" +
                "                                                IFNULL(price_month_6_begin.price,0)+IFNULL(price_month_6.price,0) price_month_6,\n" +
                "                                                IFNULL(price_month_7_begin.price,0)+IFNULL(price_month_7.price,0) price_month_7,\n" +
                "                                                IFNULL(price_month_8_begin.price,0)+IFNULL(price_month_8.price,0) price_month_8,\n" +
                "                                                IFNULL(price_month_9_begin.price,0)+IFNULL(price_month_9.price,0) price_month_9,\n" +
                "                                                IFNULL(price_month_10_begin.price,0)+IFNULL(price_month_10.price,0) price_month_10,\n" +
                "                                                IFNULL(price_month_11_begin.price,0)+IFNULL(price_month_11.price,0) price_month_11,\n" +
                "                                                IFNULL(price_month_12_begin.price,0)+IFNULL(price_month_12.price,0) price_month_12\n" +
                "                                                from  data_packages dp\n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` = 1 and create_date <= CONCAT(:toDateBegin,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) register_begin on register_begin.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` in (0,2) and create_date <= CONCAT(:toDateBegin,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) cancel_begin on cancel_begin.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) sum_begin_price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date <= CONCAT(:toDateBegin,' 23:59:59') and apply_date <= CONCAT(:toDateBegin,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= CONCAT(:toDateBegin,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_begin on price_begin.data_package = dp.code\n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` = 1 and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) register_current on register_current.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                                select\n" +
                "                                                rpd.data_package , count(*) cout\n" +
                "                                                from \n" +
                "                                                register_package_details rpd\n" +
                "                                                where `action` in (0,2) and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59')\n" +
                "                                                group by rpd.data_package\n" +
                "                                                ) cancel_current on cancel_current.data_package = dp.code \n" +
                "                                                left join \n" +
                "                                                (\n" +
                "                                select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) sum_current_price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                            where rpd.`action` = 1 and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59') and apply_date <= CONCAT(:toDateCurrent,' 23:59:59') and apply_date <= create_date\n" +
                "                            group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= CONCAT(:toDateCurrent,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                                ) price_current on price_current.data_package = dp.code\n" +
                "                               left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-01-01') and apply_date < CONCAT(:year,'-01-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-01-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_1_begin on price_month_1_begin.data_package = dp.code\n" +
                "                               left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-01-01') and create_date < concat(:year,'-02-01') and apply_date < CONCAT(:year,'-02-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-02-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_1 on price_month_1.data_package = dp.code\n" +
                "                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-02-01') and create_date < concat(:year,'-02-01') and apply_date < CONCAT(:year,'-03-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-02-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_2_begin on price_month_2_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-02-01') and create_date < concat(:year,'-03-01') and apply_date < CONCAT(:year,'-03-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-03-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_2 on price_month_2.data_package = dp.code\n" +
                "                left join \n" +
                "                                     (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-03-01') and apply_date < CONCAT(:year,'-03-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-03-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_3_begin on price_month_3_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                     (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-03-01') and create_date < concat(:year,'-04-01') and apply_date < CONCAT(:year,'-04-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-04-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_3 on price_month_3.data_package = dp.code\n" +
                "                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-04-01') and apply_date < CONCAT(:year,'-04-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-04-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_4_begin on price_month_4_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-04-01') and create_date < concat(:year,'-05-01') and apply_date < CONCAT(:year,'-05-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-05-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_4 on price_month_4.data_package = dp.code \n" +
                "                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-05-01') and apply_date < CONCAT(:year,'-05-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a\n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-05-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_5_begin on price_month_5_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-05-01') and create_date < concat(:year,'-06-01') and apply_date < CONCAT(:year,'-06-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-06-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_5 on price_month_5.data_package = dp.code \n" +
                "                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-06-01') and apply_date < CONCAT(:year,'-06-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-06-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_6_begin on price_month_6_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                    (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-06-01') and create_date < concat(:year,'-07-01') and apply_date < CONCAT(:year,'-07-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-07-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_6 on price_month_6.data_package = dp.code \n" +
                "                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-07-01')  and apply_date < CONCAT(:year,'-07-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-07-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_7_begin on price_month_7_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package\n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-07-01') and create_date < concat(:year,'-08-01') and apply_date < CONCAT(:year,'-08-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-08-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_7 on price_month_7.data_package = dp.code\n" +
                "                left join \n" +
                "                                 (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-08-01')  and apply_date < CONCAT(:year,'-08-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-08-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_8_begin on price_month_8_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                 (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-08-01') and create_date < concat(:year,'-09-01') and apply_date < CONCAT(:year,'-09-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-09-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_8 on price_month_8.data_package = dp.code \n" +
                "                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-09-01') and apply_date < CONCAT(:year,'-09-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-09-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_9_begin on price_month_9_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                   (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-09-01') and create_date < concat(:year,'-10-01') and apply_date < CONCAT(:year,'-10-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-10-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_9 on price_month_9.data_package = dp.code \n" +
                "                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-10-01') and apply_date < CONCAT(:year,'-10-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-10-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_10_begin on price_month_10_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-10-01') and create_date < concat(:year,'-11-01') and apply_date < CONCAT(:year,'-11-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-11-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_10 on price_month_10.data_package = dp.code \n" +
                "                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-11-01') and apply_date < CONCAT(:year,'-11-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-11-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_11_begin on price_month_11_begin.data_package = dp.code\n" +
                "                                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-11-01') and create_date < concat(:year,'-12-01') and apply_date < CONCAT(:year,'-12-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-12-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_11 on price_month_11.data_package = dp.code \n" +
                "                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date < CONCAT(:year,'-12-01') and apply_date < CONCAT(:year,'-12-01') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date < CONCAT(:year,'-12-01')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_12_begin on price_month_12_begin.data_package = dp.code \n" +
                "                                left join \n" +
                "                                (select \n" +
                "                                a.data_package,\n" +
                "                                sum(price) price\n" +
                "                                from\n" +
                "                                (select \n" +
                "                a.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
                "                from \n" +
                "                (select rpd.*,max(apply_date) apply_date\n" +
                "                from register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
                "                                where rpd.`action` = 1 and create_date >= CONCAT(:year,'-12-01') and create_date <= concat(:year,'-12-31') and apply_date <= CONCAT(:year,'-12-31') and apply_date <= create_date\n" +
                "                                group by rpd.id) a \n" +
                "                left join \n" +
                "                (select * from package_price where apply_date <= CONCAT(:year,'-12-31')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
                "                )a\n" +
                "                group by a.data_package\n" +
                "                ) price_month_12 on price_month_12.data_package = dp.code \n" +
                "                order by dp.name asc ";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("toDateBegin", registerPackageDetailsDTO.getToDateBegin());
        query.setParameter("fromDateCurrent", registerPackageDetailsDTO.getFromDateCurrent());
        query.setParameter("toDateCurrent", registerPackageDetailsDTO.getToDateCurrent());
        query.setParameter("year",registerPackageDetailsDTO.getYear());

        Query countQuery = entityManager.createNativeQuery("SELECT COUNT(*) FROM (" + sql + ") as x");
        countQuery.setParameter("toDateBegin", registerPackageDetailsDTO.getToDateBegin());
        countQuery.setParameter("fromDateCurrent", registerPackageDetailsDTO.getFromDateCurrent());
        countQuery.setParameter("toDateCurrent", registerPackageDetailsDTO.getToDateCurrent());
        countQuery.setParameter("year",registerPackageDetailsDTO.getYear());

        long countResult = ((BigInteger) countQuery.getSingleResult()).longValue();

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Object[]> lstQuery = query.getResultList();
        List<RegisterPackageDetailsDTO> lstTable = new ArrayList<>();
        for(Object[] obj: lstQuery) {
            RegisterPackageDetailsDTO dto = new RegisterPackageDetailsDTO();
            dto.setDataPackage(DataUtil.safeToString(obj[0]));
            dto.setDataPackageName(DataUtil.safeToString(obj[1]));
            dto.setRegisterBegin(DataUtil.safeToLong(obj[2]));
            dto.setCancelBegin(DataUtil.safeToLong(obj[3]));
            dto.setSumBeginPrice(DataUtil.safeToDouble(obj[4]));
            dto.setRegisterCurrent(DataUtil.safeToLong(obj[5]));
            dto.setCancelCurrent(DataUtil.safeToLong(obj[6]));
            dto.setSumCurrentPrice(DataUtil.safeToDouble(obj[7]));
            dto.setRegisterEnd(DataUtil.safeToLong(obj[8]));
            dto.setCancelEnd(DataUtil.safeToLong(obj[9]));
            dto.setCountActiveEnd(DataUtil.safeToDouble(obj[10]));
            dto.setSumPriceEnd(DataUtil.safeToDouble(obj[11]));
            dto.setRatioGrowthUser(DataUtil.safeToString(obj[12]));
            dto.setRatioGrowthPrice(DataUtil.safeToString(obj[13]));
            dto.setPriceMonth1(DataUtil.safeToDouble(obj[14]));
            dto.setPriceMonth2(DataUtil.safeToDouble(obj[15]));
            dto.setPriceMonth3(DataUtil.safeToDouble(obj[16]));
            dto.setPriceMonth4(DataUtil.safeToDouble(obj[17]));
            dto.setPriceMonth5(DataUtil.safeToDouble(obj[18]));
            dto.setPriceMonth6(DataUtil.safeToDouble(obj[19]));
            dto.setPriceMonth7(DataUtil.safeToDouble(obj[20]));
            dto.setPriceMonth8(DataUtil.safeToDouble(obj[21]));
            dto.setPriceMonth9(DataUtil.safeToDouble(obj[22]));
            dto.setPriceMonth10(DataUtil.safeToDouble(obj[23]));
            dto.setPriceMonth11(DataUtil.safeToDouble(obj[24]));
            dto.setPriceMonth12(DataUtil.safeToDouble(obj[25]));
            lstTable.add(dto);
        }
        return new PageImpl<>(lstTable,pageable, countResult);
    }
}
