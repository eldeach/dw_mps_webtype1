// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');



function getMachineList (app) {
    app.get('/getmachinelist', async function ( req, res ) {
        let whereSat=''
        if ( Array.isArray(req.query.approval_status)) {
            let tempArr = []
            req.query.approval_status.map((stValue, index) => {
                tempArr.push(`approval_status = '${stValue}'`)
            })
            whereSat = tempArr.join(' OR ')
        } else {
            whereSat = `approval_status = '${req.query.approval_status}'`
        }
        let rs = await sendQry(`
        SELECT
            BIN_TO_UUID(THIS_TBL.uuid_binary) AS uuid_binary,
            THIS_TBL.data_ver AS data_ver,
            THIS_TBL.data_sub_ver AS data_sub_ver,
            THIS_TBL.approval_status AS approval_status,
            THIS_TBL.remark AS remark,
            THIS_TBL.revision_history AS revision_history,
            THIS_TBL.approval_payload_id AS approval_payload_id,
            THIS_TBL.previous_approval_payload_id AS previous_approval_payload_id,
            THIS_TBL.mng_code AS mng_code,
            THIS_TBL.mng_code_alt AS mng_code_alt,
            THIS_TBL.mng_code_alt2 AS mng_code_alt2,
            THIS_TBL.mng_name AS mng_name,
            THIS_TBL.mng_team AS mng_team,
            THIS_TBL.machine_type AS machine_type,
            THIS_TBL.gmp_impact AS gmp_impact,
            THIS_TBL.periodic_mng_qual AS periodic_mng_qual,
            THIS_TBL.periodic_mng_ster AS periodic_mng_ster,
            THIS_TBL.periodic_mng_vhp AS periodic_mng_vhp,
            THIS_TBL.periodic_mng_review AS periodic_mng_review,
            THIS_TBL.periodic_mng_cv AS periodic_mng_cv,
            THIS_TBL.periodic_mng_mt AS periodic_mng_mt,
            DOC_A.mc_periodic_qual AS mc_periodic_qual,
            DOC_K.mc_periodic_vhp AS mc_periodic_vhp,
            DOC_B.mc_periodic_ster AS mc_periodic_ster,
            DOC_C.mc_periodic_review AS mc_periodic_review,
            DOC_D.mc_iq AS mc_iq,
            DOC_E.mc_oq AS mc_oq,
            DOC_F.mc_pq AS mc_pq,
            DOC_G.mc_periodic_cv AS mc_periodic_cv,
            DOC_H.mc_cv AS mc_cv,
            DOC_I.mc_periodic_mt AS mc_periodic_mt,
            DOC_J.mc_mt AS mc_mt,
            PRM_A.prm_list AS prm_list,
            PRM_B.prm_batchsize AS prm_batchsize,
            PRM_C.prm_batchsize_kg AS prm_batchsize_kg,
            PRM_D.prm_gentlewing AS prm_gentlewing,
            PRM_E.prm_chopper AS prm_chopper,
            PRM_F.prm_spray AS prm_spray,
            PRM_U.prm_spray_kgmin AS prm_spray_kgmin,
            PRM_G.prm_spray_rpm AS prm_spray_rpm,
            PRM_H.prm_grate AS prm_grate,
            PRM_I.prm_blendrpm AS prm_blendrpm,
            PRM_J.prm_cforece AS prm_cforece,
            PRM_K.prm_feeder AS prm_feeder,
            PRM_L.prm_turret AS prm_turret,
            PRM_M.prm_pforce AS prm_pforce,
            PRM_N.prm_mforce AS prm_mforce,
            PRM_O.prm_pforce_kgf AS prm_pforce_kgf,
            PRM_P.prm_mforce_kgf AS prm_mforce_kgf,
            PRM_Q.prm_drum AS prm_drum,
            PRM_R.prm_paair AS prm_paair,
            PRM_S.prm_atair AS prm_atair,
            PRM_T.prm_fill AS prm_fill
        FROM
            (SELECT *
            FROM
                tb_machine
            WHERE ${whereSat} ) AS THIS_TBL
            LEFT OUTER JOIN
            (SELECT
                mc_periodic_qual_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_periodic_qual_id":"', if(ISNULL(mc_periodic_qual_id),'',mc_periodic_qual_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_periodic_qual
            FROM tb_mc_periodic_qual GROUP BY mc_periodic_qual_id) AS DOC_A ON THIS_TBL.mc_periodic_qual_id = DOC_A.mc_periodic_qual_id
            LEFT OUTER JOIN
            (SELECT
                mc_periodic_ster_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_periodic_ster_id":"', if(ISNULL(mc_periodic_ster_id),'',mc_periodic_ster_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_periodic_ster
            FROM tb_mc_periodic_ster GROUP BY mc_periodic_ster_id) AS DOC_B ON THIS_TBL.mc_periodic_ster_id = DOC_B.mc_periodic_ster_id
            LEFT OUTER JOIN
            (SELECT
                mc_periodic_review_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_periodic_review_id":"', if(ISNULL(mc_periodic_review_id),'',mc_periodic_review_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_periodic_review
            FROM tb_mc_periodic_review GROUP BY mc_periodic_review_id) AS DOC_C ON THIS_TBL.mc_periodic_review_id = DOC_C.mc_periodic_review_id
            LEFT OUTER JOIN
            (SELECT
                mc_iq_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_iq_id":"', if(ISNULL(mc_iq_id),'',mc_iq_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_iq
            FROM tb_mc_iq GROUP BY mc_iq_id) AS DOC_D ON THIS_TBL.mc_iq_id = DOC_D.mc_iq_id
            LEFT OUTER JOIN
            (SELECT
                mc_oq_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_oq_id":"', if(ISNULL(mc_oq_id),'',mc_oq_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_oq
            FROM tb_mc_oq GROUP BY mc_oq_id) AS DOC_E ON THIS_TBL.mc_oq_id = DOC_E.mc_oq_id
            LEFT OUTER JOIN
            (SELECT
                mc_pq_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_pq_id":"', if(ISNULL(mc_pq_id),'',mc_pq_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_pq
            FROM tb_mc_pq GROUP BY mc_pq_id) AS DOC_F ON THIS_TBL.mc_pq_id = DOC_F.mc_pq_id
            LEFT OUTER JOIN
            (SELECT
                mc_periodic_cv_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_periodic_cv_id":"', if(ISNULL(mc_periodic_cv_id),'',mc_periodic_cv_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_periodic_cv
            FROM tb_mc_periodic_cv GROUP BY mc_periodic_cv_id) AS DOC_G ON THIS_TBL.mc_periodic_cv_id = DOC_G.mc_periodic_cv_id
            LEFT OUTER JOIN
            (SELECT
                mc_cv_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_cv_id":"', if(ISNULL(mc_cv_id),'',mc_cv_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                        '}') SEPARATOR ","),
                ']') AS mc_cv
            FROM tb_mc_cv GROUP BY mc_cv_id) AS DOC_H ON THIS_TBL.mc_cv_id = DOC_H.mc_cv_id
            LEFT OUTER JOIN
            (SELECT
                mc_periodic_mt_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_periodic_mt_id":"', if(ISNULL(mc_periodic_mt_id),'',mc_periodic_mt_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_periodic_mt
            FROM tb_mc_periodic_mt GROUP BY mc_periodic_mt_id) AS DOC_I ON THIS_TBL.mc_periodic_mt_id = DOC_I.mc_periodic_mt_id
            LEFT OUTER JOIN
            (SELECT
                mc_mt_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_mt_id":"', if(ISNULL(mc_mt_id),'',mc_mt_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_mt
            FROM tb_mc_mt GROUP BY mc_mt_id) AS DOC_J ON THIS_TBL.mc_mt_id = DOC_J.mc_mt_id
            LEFT OUTER JOIN
            (SELECT
                mc_periodic_vhp_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"mc_periodic_vhp_id":"', if(ISNULL(mc_periodic_vhp_id),'',mc_periodic_vhp_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS mc_periodic_vhp
            FROM tb_mc_periodic_vhp GROUP BY mc_periodic_vhp_id) AS DOC_K ON THIS_TBL.mc_periodic_vhp_id = DOC_K.mc_periodic_vhp_id
            
            
            LEFT OUTER JOIN
            (SELECT
                prm_list_id,
                CONCAT('[{',
                    GROUP_CONCAT(
                        CONCAT('"',prm_code,'":', use_prm) SEPARATOR ","),
                '}]') AS prm_list
            FROM tb_prm_list GROUP BY prm_list_id) AS PRM_A ON THIS_TBL.prm_list_id = PRM_A.prm_list_id
            
            
            LEFT OUTER JOIN
            (SELECT
                prm_batchsize_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_batchsize_id":"', if(ISNULL(prm_batchsize_id),'',prm_batchsize_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_batchsize
            FROM tb_prm_batchsize GROUP BY prm_batchsize_id) AS PRM_B ON THIS_TBL.prm_batchsize_id = PRM_B.prm_batchsize_id
            LEFT OUTER JOIN
            (SELECT
                prm_batchsize_kg_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_batchsize_kg_id":"', if(ISNULL(prm_batchsize_kg_id),'',prm_batchsize_kg_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_batchsize_kg
            FROM tb_prm_batchsize_kg GROUP BY prm_batchsize_kg_id) AS PRM_C ON THIS_TBL.prm_batchsize_kg_id = PRM_C.prm_batchsize_kg_id
            LEFT OUTER JOIN
            (SELECT
                prm_gentlewing_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_gentlewing_id":"', if(ISNULL(prm_gentlewing_id),'',prm_gentlewing_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_gentlewing
            FROM tb_prm_gentlewing GROUP BY prm_gentlewing_id) AS PRM_D ON THIS_TBL.prm_gentlewing_id = PRM_D.prm_gentlewing_id
            LEFT OUTER JOIN
            (SELECT
                prm_chopper_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_chopper_id":"', if(ISNULL(prm_chopper_id),'',prm_chopper_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_chopper
            FROM tb_prm_chopper GROUP BY prm_chopper_id) AS PRM_E ON THIS_TBL.prm_chopper_id = PRM_E.prm_chopper_id
            LEFT OUTER JOIN
            (SELECT
                prm_spray_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_spray_id":"', if(ISNULL(prm_spray_id),'',prm_spray_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_spray
            FROM tb_prm_spray GROUP BY prm_spray_id) AS PRM_F ON THIS_TBL.prm_spray_id = PRM_F.prm_spray_id
            LEFT OUTER JOIN
            (SELECT
                prm_spray_rpm_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_spray_rpm_id":"', if(ISNULL(prm_spray_rpm_id),'',prm_spray_rpm_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_spray_rpm
            FROM tb_prm_spray_rpm GROUP BY prm_spray_rpm_id) AS PRM_G ON THIS_TBL.prm_spray_rpm_id = PRM_G.prm_spray_rpm_id
            LEFT OUTER JOIN
            (SELECT
                prm_grate_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_grate_id":"', if(ISNULL(prm_grate_id),'',prm_grate_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_grate
            FROM tb_prm_grate GROUP BY prm_grate_id) AS PRM_H ON THIS_TBL.prm_grate_id = PRM_H.prm_grate_id
            LEFT OUTER JOIN
            (SELECT
                prm_blendrpm_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_blendrpm_id":"', if(ISNULL(prm_blendrpm_id),'',prm_blendrpm_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_blendrpm
            FROM tb_prm_blendrpm GROUP BY prm_blendrpm_id) AS PRM_I ON THIS_TBL.prm_blendrpm_id = PRM_I.prm_blendrpm_id
            LEFT OUTER JOIN
            (SELECT
                prm_cforece_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_cforece_id":"', if(ISNULL(prm_cforece_id),'',prm_cforece_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_cforece
            FROM tb_prm_cforece GROUP BY prm_cforece_id) AS PRM_J ON THIS_TBL.prm_cforece_id = PRM_J.prm_cforece_id
            LEFT OUTER JOIN
            (SELECT
                prm_feeder_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_feeder_id":"', if(ISNULL(prm_feeder_id),'',prm_feeder_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_feeder
            FROM tb_prm_feeder GROUP BY prm_feeder_id) AS PRM_K ON THIS_TBL.prm_feeder_id = PRM_K.prm_feeder_id
            LEFT OUTER JOIN
            (SELECT
                prm_turret_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_turret_id":"', if(ISNULL(prm_turret_id),'',prm_turret_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_turret
            FROM tb_prm_turret GROUP BY prm_turret_id) AS PRM_L ON THIS_TBL.prm_turret_id = PRM_L.prm_turret_id
            LEFT OUTER JOIN
            (SELECT
                prm_pforce_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_pforce_id":"', if(ISNULL(prm_pforce_id),'',prm_pforce_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_pforce
            FROM tb_prm_pforce GROUP BY prm_pforce_id) AS PRM_M ON THIS_TBL.prm_pforce_id = PRM_M.prm_pforce_id
            LEFT OUTER JOIN
            (SELECT
                prm_mforce_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_mforce_id":"', if(ISNULL(prm_mforce_id),'',prm_mforce_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_mforce
            FROM tb_prm_mforce GROUP BY prm_mforce_id) AS PRM_N ON THIS_TBL.prm_mforce_id = PRM_N.prm_mforce_id
            LEFT OUTER JOIN
            (SELECT
                prm_pforce_kgf_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_pforce_kgf_id":"', if(ISNULL(prm_pforce_kgf_id),'',prm_pforce_kgf_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_pforce_kgf
            FROM tb_prm_pforce_kgf GROUP BY prm_pforce_kgf_id) AS PRM_O ON THIS_TBL.prm_pforce_kgf_id = PRM_O.prm_pforce_kgf_id
            LEFT OUTER JOIN
            (SELECT
                prm_mforce_kgf_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_mforce_kgf_id":"', if(ISNULL(prm_mforce_kgf_id),'',prm_mforce_kgf_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_mforce_kgf
            FROM tb_prm_mforce_kgf GROUP BY prm_mforce_kgf_id) AS PRM_P ON THIS_TBL.prm_mforce_kgf_id = PRM_P.prm_mforce_kgf_id
            LEFT OUTER JOIN
            (SELECT
                prm_drum_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_drum_id":"', if(ISNULL(prm_drum_id),'',prm_drum_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_drum
            FROM tb_prm_drum GROUP BY prm_drum_id) AS PRM_Q ON THIS_TBL.prm_drum_id = PRM_Q.prm_drum_id
            LEFT OUTER JOIN
            (SELECT
                prm_paair_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_paair_id":"', if(ISNULL(prm_paair_id),'',prm_paair_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_paair
            FROM tb_prm_paair GROUP BY prm_paair_id) AS PRM_R ON THIS_TBL.prm_paair_id = PRM_R.prm_paair_id
            LEFT OUTER JOIN
            (SELECT
                prm_atair_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_atair_id":"', if(ISNULL(prm_atair_id),'',prm_atair_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_atair
            FROM tb_prm_atair GROUP BY prm_atair_id) AS PRM_S ON THIS_TBL.prm_atair_id = PRM_S.prm_atair_id
            LEFT OUTER JOIN
            (SELECT
                prm_fill_id,
                    CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prm_fill_id":"', if(ISNULL(prm_fill_id),'',prm_fill_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_fill
            FROM tb_prm_fill GROUP BY prm_fill_id) AS PRM_T ON THIS_TBL.prm_fill_id = PRM_T.prm_fill_id
            LEFT OUTER JOIN
            (SELECT
                prm_spray_kgmin_id,
                CONCAT('[',
                    GROUP_CONCAT(
                    CONCAT('{',
                        CONCAT('"prm_spray_kgmin_id":"', if(ISNULL(prm_spray_kgmin_id),'',prm_spray_kgmin_id),'",'),
                        CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                        CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prm_spray_kgmin
            FROM tb_prm_spray_kgmin GROUP BY prm_spray_kgmin_id) AS PRM_U ON THIS_TBL.prm_spray_kgmin_id = PRM_U.prm_spray_kgmin_id
        `)
        res.status(200).json(rs)
    })
}

module.exports = getMachineList;


/* SubQry Study

	LEFT OUTER JOIN
    (SELECT
    	prm_batchsize_id,
        CONCAT('[',
            GROUP_CONCAT(
                CONCAT('{',
                CONCAT('"prm_batchsize_id":"', if(ISNULL(prm_batchsize_id),'',prm_batchsize_id),'",'),
                CONCAT('"min_value":', if(ISNULL(min_value),null,min_value),','),
                CONCAT('"max_value":', if(ISNULL(max_value),null,max_value),','),
                CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                CONCAT('"perform_date_start":"', if(perform_date_start < '1970-01-02', NULL, date_format(perform_date_start, '%Y-%m-%d')),'",'),
                CONCAT('"perform_date_end":"', if(perform_date_end < '1970-01-02', NULL, date_format(perform_date_end, '%Y-%m-%d')),'",'),
                CONCAT('"doc_approval_date":"', if(doc_approval_date < '1970-01-02', NULL, date_format(doc_approval_date, '%Y-%m-%d')),'"'),
            '}') SEPARATOR ","),
        ']') AS prm_batchsize
    FROM tb_prm_batchsize) AS PRM_B ON THIS_TBL.prm_batchsize_id = PRM_B.prm_batchsize_id
*/