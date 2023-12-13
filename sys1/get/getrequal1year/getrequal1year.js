// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');


async function getrequal5year (app) {
    app.get('/getrequal1year', async function ( req, res ) {
        let rsSetting = await sendQry(`SELECT periodic_annual_qual, periodic_annual_qual_offset_day FROM tb_period_setting WHERE no = (SELECT max(no) AS no FROM tb_period_setting)`)

        let period = rsSetting[0].periodic_annual_qual
        let offset_day = rsSetting[0].periodic_annual_qual_offset_day
        
        let rs = await sendQry(`
        SELECT
            FINAL_TBL.data_ver,
            FINAL_TBL.data_sub_ver,
            FINAL_TBL.mng_code,
            FINAL_TBL.mng_name,
            FINAL_TBL.mng_team,
            FINAL_TBL.gmp_impact,
            ${period} AS period_month,
            FINAL_TBL.periodic_mng_1y_qual,
            FINAL_TBL.latest_approval_date,
            FINAL_TBL.next_deadline,
            FINAL_TBL.remaining_days,
            if (FINAL_TBL.remaining_days < 0 , "EXCEED", "") AS exceed
        FROM (
            SELECT
                INTER_TBL.data_ver,
                INTER_TBL.data_sub_ver,
                INTER_TBL.mng_code,
                INTER_TBL.mng_name,
                INTER_TBL.mng_team,
                INTER_TBL.gmp_impact,
                INTER_TBL.periodic_mng_1y_qual,
                INTER_TBL.latest_approval_date,
                INTER_TBL.next_deadline,
                INTER_TBL.period_month,
                DATEDIFF(INTER_TBL.next_deadline,now()) AS remaining_days
            FROM
                (SELECT
                    THIS_TBL.data_ver AS data_ver,
                    THIS_TBL.data_sub_ver AS data_sub_ver,
                    THIS_TBL.mng_code AS mng_code,
                    THIS_TBL.mng_name AS mng_name,
                    THIS_TBL.mng_team AS mng_team,
                    THIS_TBL.gmp_impact AS gmp_impact,
                    THIS_TBL.periodic_mng_1y_qual AS periodic_mng_1y_qual,
                    date_format(PR_Q_MAX_TBL.MAX_approval_date,'%Y-%m-%d') AS latest_approval_date,
                    ${period} AS period_month,
                    date_format(date_add(ADD_MONTHS(PR_Q_MAX_TBL.MAX_approval_date, ${period}),interval ${offset_day} day),'%Y-%m-%d') AS next_deadline
                FROM
                    tb_machine AS THIS_TBL
                    LEFT OUTER JOIN (
                        SELECT mc_periodic_1y_qual_id, MAX(doc_approval_date) AS MAX_approval_date FROM tb_mc_periodic_1y_qual GROUP BY mc_periodic_1y_qual_id
                    ) AS PR_Q_MAX_TBL
                    ON THIS_TBL.mc_periodic_1y_qual_id = PR_Q_MAX_TBL.mc_periodic_1y_qual_id
                WHERE
                    THIS_TBL.approval_status = 'APPROVED'
                    AND THIS_TBL.periodic_mng_1y_qual = 1
                ) AS INTER_TBL
        ) AS FINAL_TBL
        `.replace(/\n/g, "")
        )
        res.status(200).json(rs)
    })
}

module.exports = getrequal5year;