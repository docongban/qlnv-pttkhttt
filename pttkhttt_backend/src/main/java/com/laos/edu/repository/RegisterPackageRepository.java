package com.laos.edu.repository;

import com.laos.edu.domain.RegisterPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the RegisterPackage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RegisterPackageRepository extends JpaRepository<RegisterPackage, Long> {

    @Query(nativeQuery = true, value="select * from register_package WHERE regis_pack_code_school = ?1 and school_code = ?2 ")
    RegisterPackage findByRegisPackCodeSchool(Long regisPackCodeSchool, String schoolCode);


    @Query(nativeQuery = true, value="select * from register_package WHERE (status = 1 or status = 2) and student_code = binary ?1 and shool_year=?2")
    List<RegisterPackage> findListRegisterPackage(String studentCode, String years);


    @Query(nativeQuery = true, value="select * from register_package WHERE status = ?1 and active_date is not null")
    List<RegisterPackage> findRegisterPackagesByStatusAndActiveDateExists(Long status);

    @Query(nativeQuery = true, value="SELECT * FROM unitel.register_package WHERE end_date < now()")
    List<RegisterPackage> cancelRegisterPackageExpired();

    RegisterPackage findByCode(String code);

    @Query(value = "select \n" +
        "                dp.code ,\n" +
        "                dp.name,\n" +
        "                (IFNULL(register_begin.cout,0)+IFNULL(register_current.cout,0))-(IFNULL(cancel_begin.cout,0)+IFNULL(cancel_current.cout,0)) active_end,\n" +
        "                IFNULL(price_begin.sum_begin_price,0)+IFNULL(price_current.sum_current_price,0) price_end " +
        "                                from  data_packages dp\n" +
        "                                left join \n" +
        "                                (\n" +
        "                                select\n" +
        "                                rpd.data_package , count(*) cout\n" +
        "                                from \n" +
        "                                register_package_details rpd\n" +
        "                                where `action` = 1 and create_date <= CONCAT(:toDateBegin,' 23:59:59')\n" +
        "                                group by rpd.data_package\n" +
        "                                ) register_begin on register_begin.data_package = dp.code \n" +
        "                                left join \n" +
        "                                (\n" +
        "                                select\n" +
        "                                rpd.data_package , count(*) cout\n" +
        "                                from \n" +
        "                                register_package_details rpd\n" +
        "                                where `action` in (0,2) and create_date <= CONCAT(:toDateBegin,' 23:59:59')\n" +
        "                                group by rpd.data_package\n" +
        "                                ) cancel_begin on cancel_begin.data_package = dp.code \n" +
        "                                left join \n" +
        "                                (select \n" +
        "\t\t\t\t\t                a.data_package,\n" +
        "\t\t\t\t\t                sum(price) sum_begin_price\n" +
        "\t\t\t\t\t                from\n" +
        "\t\t\t\t\t                (select \n" +
        "\t\t\t\t\t\t\t\t\ta.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
        "\t\t\t\t\t\t\t\t\tfrom \n" +
        "\t\t\t\t\t\t\t\t\t(select rpd.*,max(apply_date) apply_date\n" +
        "\t\t\t\t\t\t\t\t\tfrom register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
        "\t\t\t\t\t\t            where rpd.`action` = 1 and create_date <= CONCAT(:toDateBegin,' 23:59:59') and apply_date <= CONCAT(:toDateBegin,' 23:59:59') and apply_date <= create_date\n" +
        "\t\t\t\t\t\t            group by rpd.id) a \n" +
        "\t\t\t\t\t\t\t\t\tleft join \n" +
        "\t\t\t\t\t\t\t\t\t(select * from package_price where apply_date <= CONCAT(:toDateBegin,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
        "\t\t\t\t\t\t\t\t\t)a\n" +
        "\t\t\t\t\t\t\t\tgroup by a.data_package\n" +
        "\t\t\t\t\t\t\t) price_begin on price_begin.data_package = dp.code\n" +
        "                                left join \n" +
        "                                (\n" +
        "                                select\n" +
        "                                rpd.data_package , count(*) cout\n" +
        "                                from \n" +
        "                                register_package_details rpd\n" +
        "                                where `action` = 1 and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59')\n" +
        "                                group by rpd.data_package\n" +
        "                                ) register_current on register_current.data_package = dp.code \n" +
        "                                left join \n" +
        "                                (\n" +
        "                                select\n" +
        "                                rpd.data_package , count(*) cout\n" +
        "                                from \n" +
        "                                register_package_details rpd\n" +
        "                                where `action` in (0,2) and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59')\n" +
        "                                group by rpd.data_package\n" +
        "                                ) cancel_current on cancel_current.data_package = dp.code \n" +
        "                                left join \n" +
        "                                (\n" +
        "\t\t\t                select \n" +
        "\t\t\t\t                a.data_package,\n" +
        "\t\t\t\t                sum(price) sum_current_price\n" +
        "\t\t\t\t                from\n" +
        "\t\t\t\t                (select \n" +
        "\t\t\t\t\t\t\t\ta.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
        "\t\t\t\t\t\t\t\tfrom \n" +
        "\t\t\t\t\t\t\t\t(select rpd.*,max(apply_date) apply_date\n" +
        "\t\t\t\t\t\t\t\tfrom register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
        "\t\t\t\t\t            where rpd.`action` = 1 and create_date >= :fromDateCurrent and create_date <= CONCAT(:toDateCurrent,' 23:59:59') and apply_date <= CONCAT(:toDateCurrent,' 23:59:59') and apply_date <= create_date\n" +
        "\t\t\t\t\t            group by rpd.id) a \n" +
        "\t\t\t\t\t\t\t\tleft join \n" +
        "\t\t\t\t\t\t\t\t(select * from package_price where apply_date <= CONCAT(:toDateCurrent,' 23:59:59')) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
        "\t\t\t\t\t\t\t\t)a\n" +
        "\t\t\t\t\t\t\tgroup by a.data_package\n" +
        "\t                ) price_current on price_current.data_package = dp.code\n " +
        "order by dp.name asc", nativeQuery = true)
    List<Object[]> loadChart(
        @Param("toDateBegin") String toDateBegin,
        @Param("fromDateCurrent") String fromDateCurrent,
        @Param("toDateCurrent") String toDateCurrent
    );

    @Query(value = "select  \n" +
        "                (IFNULL(count_begin_register, 0) +IFNULL(count_current_register,0))-(IFNULL(count_begin_cancel,0)+IFNULL(count_current_cancel,0)) sl_dang_hoat_dong_cuoi_ky, \n" +
        "                case when count_begin = 0 then '-'  \n" +
        "                when count_begin > 0 then ((( (IFNULL(count_begin_register,0)+IFNULL(count_current_register,0))-(IFNULL(count_begin_cancel,0)+IFNULL(count_current_cancel,0)))/count_begin_register)-1)*100  end ti_le_tang_truong_nguoi_dung, \n" +
        "                IFNULL(sum_begin_prince,0)+IFNULL(sum_current_prince,0) doanh_thu_cuoi_ky, \n" +
        "                case when sum_begin_prince = 0 then '-' " +
        "                when sum_begin_prince > 0 then " +
        "                (((IFNULL(sum_begin_prince,0)+IFNULL(sum_current_prince,0))/sum_begin_prince)-1)*100 end ti_le_tang_truong_doanh_thu \n" +
        "                FROM \n" +
        "                (select count(*)count_begin from register_package_details where create_date <= :toDateBegin) be, \n" +
        "                (select count(*)count_begin_register from register_package_details where create_date <= :toDateBegin and `action`  = 1)begin_register, \n" +
        "                (select count(*)count_begin_cancel from register_package_details where create_date <= :toDateBegin and `action` in (0,2))begin_cancel, \n" +
        "                (select count(*) count_current from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= :toDateCurrent)cur, \n" +
        "                (select count(*) count_current_register from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= :toDateCurrent and `action` = 1) cur_register, \n" +
        "                (select count(*) count_current_cancel from register_package_details rpd where create_date >= :fromDateCurrent and create_date  <= :toDateCurrent and `action` in(0,2)) cur_cancel, \n" +
        "                (select \n" +
        "\t\t\t\tsum(price) sum_begin_prince\n" +
        "\t\t\t\tfrom\n" +
        "            (select \n" +
        "\t\t\t\t\t\t\t\ta.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
        "\t\t\t\t\t\t\t\tfrom \n" +
        "\t\t\t\t\t\t\t\t(select rpd.*,max(apply_date) apply_date\n" +
        "\t\t\t\t\t\t\t\tfrom register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
        "\t\t\t\t\t            where rpd.`action` = 1 and create_date <= :toDateBegin and apply_date <= :toDateBegin and apply_date <= create_date\n" +
        "\t\t\t\t\t            group by rpd.id) a \n" +
        "\t\t\t\t\t\t\t\tleft join \n" +
        "\t\t\t\t\t\t\t\t(select * from package_price where apply_date <= :toDateBegin) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
        "            )a) sum_beg_pri,\n" +
        "                                (select\n" +
        "            sum(price) sum_current_prince\n" +
        "            from\n" +
        "            (select \n" +
        "\t\t\t\t\t\t\t\ta.id, a.data_package, a.create_date , a.apply_date,  pp2.prices price\n" +
        "\t\t\t\t\t\t\t\tfrom \n" +
        "\t\t\t\t\t\t\t\t(select rpd.*,max(apply_date) apply_date\n" +
        "\t\t\t\t\t\t\t\tfrom register_package_details rpd left join package_price pp on pp.package_code = rpd.data_package \n" +
        "\t\t\t\t\t            where rpd.`action` = 1 and create_date >= :fromDateCurrent and create_date <= :toDateCurrent and apply_date <= :toDateCurrent and apply_date <= create_date\n" +
        "\t\t\t\t\t            group by rpd.id) a \n" +
        "\t\t\t\t\t\t\t\tleft join \n" +
        "\t\t\t\t\t\t\t\t(select * from package_price where apply_date <= :toDateCurrent) pp2 on a.data_package = pp2.package_code  and a.apply_date = pp2.apply_date\n" +
        "            )a) sum_current_pri ", nativeQuery = true)
    List<Object[]> getCountUserAndRevenue(
        @Param("toDateBegin") String toDateBegin,
        @Param("fromDateCurrent") String fromDateCurrent,
        @Param("toDateCurrent") String toDateCurrent
    );






}
