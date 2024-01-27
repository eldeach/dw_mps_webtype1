// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getEqPrm (app) {
    app.get('/geteqprm', async function ( req, res ) {
      
        let rs = await sendQry(`
        SELECT
            THIS_TBL.data_ver AS data_ver,
            THIS_TBL.data_sub_ver AS data_sub_ver,
            THIS_TBL.mng_code AS mng_code,
            THIS_TBL.mng_name AS mng_name,
            THIS_TBL.mng_team AS mng_team,
            PRM_B.min_value AS prm_batchsize_min_value,
            PRM_B.max_value AS prm_batchsize_max_value,
            PRM_C.min_value AS prm_batchsize_kg_min_value,
            PRM_C.max_value AS prm_batchsize_kg_max_value,
            PRM_D.min_value AS prm_gentlewing_min_value,
            PRM_D.max_value AS prm_gentlewing_max_value,
            PRM_E.min_value AS prm_chopper_min_value,
            PRM_E.max_value AS prm_chopper_max_value,
            PRM_F.min_value AS prm_spray_min_value,
            PRM_F.max_value AS prm_spray_max_value,
            PRM_U.min_value AS prm_spray_kgmin_min_value,
            PRM_U.max_value AS prm_spray_kgmin_max_value,
            PRM_G.min_value AS prm_spray_rpm_min_value,
            PRM_G.max_value AS prm_spray_rpm_max_value,
            PRM_X.min_value AS prm_gra_spray_air_min_value,
            PRM_X.max_value AS prm_gra_spray_air_max_value,
            PRM_Y.min_value AS prm_gra_micro_prs_min_value,
            PRM_Y.max_value AS prm_gra_micro_prs_max_value,
            PRM_V.min_value AS prm_inlet_air_temp_min_value,
            PRM_V.max_value AS prm_inlet_air_temp_max_value,
            PRM_AG.min_value AS prm_exh_air_temp_min_value,
            PRM_AG.max_value AS prm_exh_air_temp_max_value,
            PRM_W.min_value AS prm_inlet_air_vol_min_value,
            PRM_W.max_value AS prm_inlet_air_vol_max_value,
            PRM_AH.min_value AS prm_inlet_air_vol_rpm_min_value,
            PRM_AH.max_value AS prm_inlet_air_vol_rpm_max_value,
            PRM_Z.min_value AS prm_roller_speed_min_value,
            PRM_Z.max_value AS prm_roller_speed_max_value,
            PRM_AA.min_value AS prm_roller_gap_min_value,
            PRM_AA.max_value AS prm_roller_gap_max_value,
            PRM_H.min_value AS prm_grate_min_value,
            PRM_H.max_value AS prm_grate_max_value,
            PRM_I.min_value AS prm_blendrpm_min_value,
            PRM_I.max_value AS prm_blendrpm_max_value,
            PRM_AC.min_value AS prm_filling_depth_min_value,
            PRM_AC.max_value AS prm_filling_depth_max_value,
            PRM_J.min_value AS prm_cforece_min_value,
            PRM_J.max_value AS prm_cforece_max_value,
            PRM_K.min_value AS prm_feeder_min_value,
            PRM_K.max_value AS prm_feeder_max_value,
            PRM_AF.min_value AS prm_feeder_2nd_min_value,
            PRM_AF.max_value AS prm_feeder_2nd_max_value,
            PRM_L.min_value AS prm_turret_min_value,
            PRM_L.max_value AS prm_turret_max_value,
            PRM_M.min_value AS prm_pforce_min_value,
            PRM_M.max_value AS prm_pforce_max_value,
            PRM_N.min_value AS prm_mforce_min_value,
            PRM_N.max_value AS prm_mforce_max_value,
            PRM_AD.min_value AS prm_pforce_2nd_min_value,
            PRM_AD.max_value AS prm_pforce_2nd_max_value,
            PRM_AE.min_value AS prm_mforce_2nd_min_value,
            PRM_AE.max_value AS prm_mforce_2nd_max_value,
            PRM_O.min_value AS prm_pforce_kgf_min_value,
            PRM_O.max_value AS prm_pforce_kgf_max_value,
            PRM_P.min_value AS prm_mforce_kgf_min_value,
            PRM_P.max_value AS prm_mforce_kgf_max_value,
            PRM_Q.min_value AS prm_drum_min_value,
            PRM_Q.max_value AS prm_drum_max_value,
            PRM_R.min_value AS prm_paair_min_value,
            PRM_R.max_value AS prm_paair_max_value,
            PRM_S.min_value AS prm_atair_min_value,
            PRM_S.max_value AS prm_atair_max_value,
            PRM_T.min_value AS prm_fill_min_value,
            PRM_T.max_value AS prm_fill_max_value,
            PRM_AI.min_value AS prm_timer_min_value,
            PRM_AI.max_value AS prm_timer_max_value
        FROM
        (SELECT *
        FROM
            tb_machine
        WHERE machine_type = 'EQ' AND approval_status = 'APPROVED'
            ) AS THIS_TBL
        LEFT OUTER JOIN
                (SELECT
                prm_batchsize_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_batchsize GROUP BY prm_batchsize_id) AS PRM_B ON THIS_TBL.prm_batchsize_id = PRM_B.prm_batchsize_id
            LEFT OUTER JOIN
                (SELECT
                prm_batchsize_kg_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_batchsize_kg GROUP BY prm_batchsize_kg_id) AS PRM_C ON THIS_TBL.prm_batchsize_kg_id = PRM_C.prm_batchsize_kg_id
            LEFT OUTER JOIN
                (SELECT
                prm_gentlewing_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_gentlewing GROUP BY prm_gentlewing_id) AS PRM_D ON THIS_TBL.prm_gentlewing_id = PRM_D.prm_gentlewing_id
            LEFT OUTER JOIN
                (SELECT
                prm_chopper_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_chopper GROUP BY prm_chopper_id) AS PRM_E ON THIS_TBL.prm_chopper_id = PRM_E.prm_chopper_id
            LEFT OUTER JOIN
                (SELECT
                prm_spray_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_spray GROUP BY prm_spray_id) AS PRM_F ON THIS_TBL.prm_spray_id = PRM_F.prm_spray_id
            LEFT OUTER JOIN
                (SELECT
                prm_spray_kgmin_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_spray_kgmin GROUP BY prm_spray_kgmin_id) AS PRM_U ON THIS_TBL.prm_spray_kgmin_id = PRM_U.prm_spray_kgmin_id
            LEFT OUTER JOIN
                (SELECT
                prm_spray_rpm_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_spray_rpm GROUP BY prm_spray_rpm_id) AS PRM_G ON THIS_TBL.prm_spray_rpm_id = PRM_G.prm_spray_rpm_id
            LEFT OUTER JOIN
                (SELECT
                prm_grate_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_grate GROUP BY prm_grate_id) AS PRM_H ON THIS_TBL.prm_grate_id = PRM_H.prm_grate_id
            LEFT OUTER JOIN
                (SELECT
                prm_blendrpm_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_blendrpm GROUP BY prm_blendrpm_id) AS PRM_I ON THIS_TBL.prm_blendrpm_id = PRM_I.prm_blendrpm_id
            LEFT OUTER JOIN
                (SELECT
                prm_cforece_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_cforece GROUP BY prm_cforece_id) AS PRM_J ON THIS_TBL.prm_cforece_id = PRM_J.prm_cforece_id
            LEFT OUTER JOIN
                (SELECT
                prm_feeder_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_feeder GROUP BY prm_feeder_id) AS PRM_K ON THIS_TBL.prm_feeder_id = PRM_K.prm_feeder_id
            LEFT OUTER JOIN
                (SELECT
                prm_turret_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_turret GROUP BY prm_turret_id) AS PRM_L ON THIS_TBL.prm_turret_id = PRM_L.prm_turret_id
            LEFT OUTER JOIN
                (SELECT
                prm_pforce_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_pforce GROUP BY prm_pforce_id) AS PRM_M ON THIS_TBL.prm_pforce_id = PRM_M.prm_pforce_id
            LEFT OUTER JOIN
                (SELECT
                prm_mforce_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_mforce GROUP BY prm_mforce_id) AS PRM_N ON THIS_TBL.prm_mforce_id = PRM_N.prm_mforce_id
            LEFT OUTER JOIN
                (SELECT
                prm_pforce_kgf_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_pforce_kgf GROUP BY prm_pforce_kgf_id) AS PRM_O ON THIS_TBL.prm_pforce_kgf_id = PRM_O.prm_pforce_kgf_id
            LEFT OUTER JOIN
                (SELECT
                prm_mforce_kgf_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_mforce_kgf GROUP BY prm_mforce_kgf_id) AS PRM_P ON THIS_TBL.prm_mforce_kgf_id = PRM_P.prm_mforce_kgf_id	
            LEFT OUTER JOIN
                (SELECT
                prm_drum_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_drum GROUP BY prm_drum_id) AS PRM_Q ON THIS_TBL.prm_drum_id = PRM_Q.prm_drum_id
            LEFT OUTER JOIN
                (SELECT
                prm_paair_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_paair GROUP BY prm_paair_id) AS PRM_R ON THIS_TBL.prm_paair_id = PRM_R.prm_paair_id
            LEFT OUTER JOIN
                (SELECT
                prm_atair_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_atair GROUP BY prm_atair_id) AS PRM_S ON THIS_TBL.prm_atair_id = PRM_S.prm_atair_id
            LEFT OUTER JOIN
                (SELECT
                prm_fill_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_fill GROUP BY prm_fill_id) AS PRM_T ON THIS_TBL.prm_fill_id = PRM_T.prm_fill_id
            LEFT OUTER JOIN
                (SELECT
                prm_inlet_air_temp_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_inlet_air_temp GROUP BY prm_inlet_air_temp_id) AS PRM_V ON THIS_TBL.prm_inlet_air_temp_id = PRM_V.prm_inlet_air_temp_id
            LEFT OUTER JOIN
                (SELECT
                prm_inlet_air_vol_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_inlet_air_vol GROUP BY prm_inlet_air_vol_id) AS PRM_W ON THIS_TBL.prm_inlet_air_vol_id = PRM_W.prm_inlet_air_vol_id
            LEFT OUTER JOIN
                (SELECT
                prm_gra_spray_air_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_gra_spray_air GROUP BY prm_gra_spray_air_id) AS PRM_X ON THIS_TBL.prm_gra_spray_air_id = PRM_X.prm_gra_spray_air_id
            LEFT OUTER JOIN
                (SELECT
                prm_gra_micro_prs_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_gra_micro_prs GROUP BY prm_gra_micro_prs_id) AS PRM_Y ON THIS_TBL.prm_gra_micro_prs_id = PRM_Y.prm_gra_micro_prs_id
            LEFT OUTER JOIN
                (SELECT
                prm_roller_speed_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_roller_speed GROUP BY prm_roller_speed_id) AS PRM_Z ON THIS_TBL.prm_roller_speed_id = PRM_Z.prm_roller_speed_id
            LEFT OUTER JOIN
                (SELECT
                prm_roller_gap_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_roller_gap GROUP BY prm_roller_gap_id) AS PRM_AA ON THIS_TBL.prm_roller_gap_id = PRM_AA.prm_roller_gap_id
            LEFT OUTER JOIN
                (SELECT
                prm_filling_depth_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_filling_depth GROUP BY prm_filling_depth_id) AS PRM_AC ON THIS_TBL.prm_filling_depth_id = PRM_AC.prm_filling_depth_id
            LEFT OUTER JOIN
                (SELECT
                prm_pforce_2nd_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_pforce_2nd GROUP BY prm_pforce_2nd_id) AS PRM_AD ON THIS_TBL.prm_pforce_2nd_id = PRM_AD.prm_pforce_2nd_id
            LEFT OUTER JOIN
                (SELECT
                prm_mforce_2nd_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_mforce_2nd GROUP BY prm_mforce_2nd_id) AS PRM_AE ON THIS_TBL.prm_mforce_2nd_id = PRM_AE.prm_mforce_2nd_id
            LEFT OUTER JOIN
                (SELECT
                prm_feeder_2nd_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_feeder_2nd GROUP BY prm_feeder_2nd_id) AS PRM_AF ON THIS_TBL.prm_feeder_2nd_id = PRM_AF.prm_feeder_2nd_id
            LEFT OUTER JOIN
                (SELECT
                prm_exh_air_temp_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_exh_air_temp GROUP BY prm_exh_air_temp_id) AS PRM_AG ON THIS_TBL.prm_exh_air_temp_id = PRM_AG.prm_exh_air_temp_id
            LEFT OUTER JOIN
                (SELECT
                prm_inlet_air_vol_rpm_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_inlet_air_vol_rpm GROUP BY prm_inlet_air_vol_rpm_id) AS PRM_AH ON THIS_TBL.prm_inlet_air_vol_rpm_id = PRM_AH.prm_inlet_air_vol_rpm_id
            LEFT OUTER JOIN
                (SELECT
                prm_timer_id,
                MIN(min_value) AS min_value,
                MAX(max_value) AS max_value
                FROM tb_prm_timer GROUP BY prm_timer_id) AS PRM_AI ON THIS_TBL.prm_timer_id = PRM_AI.prm_timer_id
        `.replace(/\n/g, "")
        )
        res.status(200).json(rs)
    })
}

module.exports = getEqPrm;