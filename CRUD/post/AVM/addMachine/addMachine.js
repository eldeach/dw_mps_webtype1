// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');

// bone_system
// dbSelect
const selectPkValueExist = require('../../../../bone_system/dbTransComponent/dbSelect/selectPkValueExist')
const selectPkMaxVer = require('../../../../bone_system/dbTransComponent/dbSelect/selectPkMaxVer')
const selectSubmitPossibleCheck = require('../../../../bone_system/dbTransComponent/dbSelect/selectSubmitPossibleCheck')
// dbInsert
const insertNewApprovalPayload = require('../../../../bone_system/dbTransComponent/dbInsert/insertNewApprovalPayload');
const insertNewApprovalId = require('../../../../bone_system/dbTransComponent/dbInsert/insertNewApprovalId');
const insertNewIdNumber = require('../../../../bone_system/dbTransComponent/dbInsert/insertNewIdNumber');

//elecSign
//dbselect
const selectPreparedType = require('../../../../bone_system/put/elecSign/dbTransComponent/dbSelect/selectPreparedType')
//dbUpdate
const updateApprovalPayloadFinish = require('../../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateApprovalPayloadFinish')
const updateApprovalStatus = require('../../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateApprovalStatus')
const updateOldApproved = require('../../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateOldApproved')

// its Object
const addMachineMsg = require('./addMachineMsg');

// its components - dbInsert
const insertDetailedMcDoc = require('./insertSubRecord/insertDetailedMcDoc')
const insertDetailedMcPrmList = require('./insertSubRecord/insertDetailedMcPrmList')
const insertDetailedMcPrm = require('./insertSubRecord/insertDetailedMcPrm')


async function addMachine ( app ) {
    app.post('/addmachine', async function( req, res ) {
        // console.log(req.body)
        let duplicatedPk = await selectPkValueExist('tb_machine', 'mng_code', req.body.mng_code) // 중복된 PK 값이 이미 있는지 (NEW 타입인 경우 막을 목적)

        let max_data_ver = await selectPkMaxVer('tb_machine', 'mng_code', req.body.mng_code) // 해당 PK의 최대 데이터 버전 확인
        let sumbitPossible = await selectSubmitPossibleCheck(max_data_ver, 'tb_machine', 'mng_code', req.body.mng_code ) // 해당 PK의 최대 데이터 버전의 레코드 승인상태 확인
    
    
        let revisionPossible = false
        if ( sumbitPossible.length > 0 ) {
            // 최대 버전을 가진 레코드의 승인상태가 'PREPARED', 'UNDER_APPROVAL' 둘 다 아닌경우 true
            revisionPossible = !(sumbitPossible[0].approval_status == 'PREPARED' || sumbitPossible[0].approval_status == 'UNDER_APPROVAL')
        } else {
            // 해당 PK의 최대 데이터 버전의 레코드가 없다는 뜻이기 때문에 true (사실 해당 PK값을 가진 레코드가 없기 때문)
            revisionPossible = true
        }

        if ( duplicatedPk && req.body.prepared_type === "NEW") { // 새로운 데이터 추가인데 중복된 경우 걸러주기
            res.status(452).json(addMachineMsg.addFail.duplicated)
        } else if ( !revisionPossible ) { // 개정인 경우 진행 중인 건이 이미 있으면 걸러주기 (NEW 타입인 경우 이미 위에서 거른 걸로 OK인 상황)
            res.status(452).json(addMachineMsg.addFail.alreadyInProgress)
        } else {
            // console.log('approval_payload_id')
            // 결재라인 준비
            // 새 결재라인 ID 발행받기 (DB에 저장)
            let approval_payload_id = await insertNewApprovalId('tb_machine', 'avm', 'Machine System (설비 시스템)', 'AVM', req.body.prepared_type, req.user )
            // 새로 발행받은 결재라인 ID로 결재라인 정보 DB에 저장하기
            let apStoreRs = await insertNewApprovalPayload(approval_payload_id, req.body.approval_payload)

            // console.log('mc_periodic_1y_qual_id')
            // 정기적 재적격성 평가 저장 준비
            // 새 정기적 재적격성 평가 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_1y_qual_id = await insertNewIdNumber( 'mc_periodic_1y_qual_id', 'tb_mc_periodic_1y_qual_id', 'mp1yqi_' )
            // 새로 받은 정기적 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_1y_qual = await insertDetailedMcDoc( 'tb_mc_periodic_1y_qual', 'mc_periodic_1y_qual_id', mc_periodic_1y_qual_id, req.body.mc_periodic_1y_qual )
            
            // console.log('mc_periodic_qual_id')
            // 정기적 재적격성 평가 저장 준비
            // 새 정기적 재적격성 평가 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_qual_id = await insertNewIdNumber( 'mc_periodic_qual_id', 'tb_mc_periodic_qual_id', 'mpqi_' )
            // 새로 받은 정기적 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_qual = await insertDetailedMcDoc( 'tb_mc_periodic_qual', 'mc_periodic_qual_id', mc_periodic_qual_id, req.body.mc_periodic_qual )
            
            // console.log('mc_periodic_ster_id')
            // 정기적 멸균 재적격성 평가 저장 준비
            // 새 정기적 멸균 재적격성 평가 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_ster_id = await insertNewIdNumber( 'mc_periodic_ster_id', 'tb_mc_periodic_ster_id', 'mpsi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_ster = await insertDetailedMcDoc( 'tb_mc_periodic_ster', 'mc_periodic_ster_id', mc_periodic_ster_id, req.body.mc_periodic_ster )

            // console.log('mc_periodic_vhp_id')
            // 정기적 VHP 재적격성 평가 저장 준비
            // 새 정기적 VHP 재적격성 평가 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_vhp_id = await insertNewIdNumber( 'mc_periodic_vhp_id', 'tb_mc_periodic_vhp_id', 'mpvhpi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_vhp = await insertDetailedMcDoc( 'tb_mc_periodic_vhp', 'mc_periodic_vhp_id', mc_periodic_vhp_id, req.body.mc_periodic_vhp )

            // console.log('mc_periodic_review_id')
            // 정기적 점검 저장 준비
            // 새 정기적 점검 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_review_id = await insertNewIdNumber( 'mc_periodic_review_id', 'tb_mc_periodic_review_id', 'mpri_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_review = await insertDetailedMcDoc( 'tb_mc_periodic_review', 'mc_periodic_review_id', mc_periodic_review_id, req.body.mc_periodic_review )

            // console.log('mc_iq_id')
            // IQ 저장 준비
            // 새 IQ ID 발행받기 (DB에 저장)
            let mc_iq_id = await insertNewIdNumber( 'mc_iq_id', 'tb_mc_iq_id', 'miqi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_iq = await insertDetailedMcDoc( 'tb_mc_iq', 'mc_iq_id', mc_iq_id, req.body.mc_iq )

            // console.log('mc_oq_id')
            // OQ 저장 준비
            // 새 OQ ID 발행받기 (DB에 저장)
            let mc_oq_id = await insertNewIdNumber( 'mc_oq_id', 'tb_mc_oq_id', 'moqi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_oq = await insertDetailedMcDoc( 'tb_mc_oq', 'mc_oq_id', mc_oq_id, req.body.mc_oq )

            // console.log('mc_pq_id')
            // PQ 저장 준비
            // 새 PQ ID 발행받기 (DB에 저장)
            let mc_pq_id = await insertNewIdNumber( 'mc_pq_id', 'tb_mc_pq_id', 'mpqi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_pq = await insertDetailedMcDoc( 'tb_mc_pq', 'mc_pq_id', mc_pq_id, req.body.mc_pq )

            // console.log('mc_periodic_cv_id')
            // Periodic CV 저장 준비
            // 새 Periodic CV ID 발행받기 (DB에 저장)
            let mc_periodic_cv_id = await insertNewIdNumber( 'mc_periodic_cv_id', 'tb_mc_periodic_cv_id', 'mpci_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_cv = await insertDetailedMcDoc( 'tb_mc_periodic_cv', 'mc_periodic_cv_id', mc_periodic_cv_id, req.body.mc_periodic_cv )

            // console.log('mc_cv_id')
            // mc_cv 저장 준비
            // 새 mc_cv ID 발행받기 (DB에 저장)
            let mc_cv_id = await insertNewIdNumber( 'mc_cv_id', 'tb_mc_cv_id', 'mcvi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_cv = await insertDetailedMcDoc( 'tb_mc_cv', 'mc_cv_id', mc_cv_id, req.body.mc_cv )

            // console.log('mc_periodic_mt_id')
            // Periodic Mapping 저장 준비
            // 새 Periodic Mapping ID 발행받기 (DB에 저장)
            let mc_periodic_mt_id = await insertNewIdNumber( 'mc_periodic_mt_id', 'tb_mc_periodic_mt_id', 'mpmi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_mt = await insertDetailedMcDoc( 'tb_mc_periodic_mt', 'mc_periodic_mt_id', mc_periodic_mt_id, req.body.mc_periodic_mt )

            // console.log('mc_periodic_1y_mt')
            // mc_mt 저장 준비
            // 새 mc_mt ID 발행받기 (DB에 저장)
            let mc_periodic_1y_mt_id = await insertNewIdNumber( 'mc_periodic_1y_mt_id', 'tb_mc_periodic_1y_mt_id', 'm1ypmi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_1y_mt = await insertDetailedMcDoc( 'tb_mc_periodic_1y_mt', 'mc_periodic_1y_mt_id', mc_periodic_1y_mt_id, req.body.mc_periodic_1y_mt )

            // console.log('mc_mt_id')
            // mc_mt 저장 준비
            // 새 mc_mt ID 발행받기 (DB에 저장)
            let mc_mt_id = await insertNewIdNumber( 'mc_mt_id', 'tb_mc_mt_id', 'mmti_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_mt = await insertDetailedMcDoc( 'tb_mc_mt', 'mc_mt_id', mc_mt_id, req.body.mc_mt )

            // console.log('mc_periodic_season_mt_id')
            // mc_mt 저장 준비
            // 새 mc_mt ID 발행받기 (DB에 저장)
            let mc_periodic_season_mt_id = await insertNewIdNumber( 'mc_periodic_season_mt_id', 'tb_mc_periodic_season_mt_id', 'mpsmi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_season_mt = await insertDetailedMcDoc( 'tb_mc_periodic_season_mt', 'mc_periodic_season_mt_id', mc_periodic_season_mt_id, req.body.mc_periodic_season_mt )

            // console.log('prm_list_id')
            // prm_list 저장 준비
            // 새 prm_list ID 발행받기 (DB에 저장)
            let prm_list_id = await insertNewIdNumber( 'prm_list_id', 'tb_prm_list_id', 'plisti_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_list = await insertDetailedMcPrmList( prm_list_id, req.body.prm_list )
            
            // console.log('prm_batchsize_id')
            // prm_batchsize 검증 저장 준비
            // 새 prm_batchsize 검증 ID 발행받기 (DB에 저장)
            let prm_batchsize_id = await insertNewIdNumber( 'prm_batchsize_id', 'tb_prm_batchsize_id', 'pbsi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_batchsize = await insertDetailedMcPrm( 'tb_prm_batchsize', 'prm_batchsize_id', prm_batchsize_id, req.body.prm_batchsize )
            
            // console.log('prm_batchsize_kg_id')
            // prm_batchsize_kg 검증 저장 준비
            // 새 prm_batchsize_kg 검증 ID 발행받기 (DB에 저장)
            let prm_batchsize_kg_id = await insertNewIdNumber( 'prm_batchsize_kg_id', 'tb_prm_batchsize_kg_id', 'pbskgi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_batchsize_kg = await insertDetailedMcPrm( 'tb_prm_batchsize_kg', 'prm_batchsize_kg_id', prm_batchsize_kg_id, req.body.prm_batchsize_kg )
            
            // console.log('prm_batchsize_vial_id')
            // prm_batchsize_vial 검증 저장 준비
            // 새 prm_batchsize_vial 검증 ID 발행받기 (DB에 저장)
            let prm_batchsize_vial_id = await insertNewIdNumber( 'prm_batchsize_vial_id', 'tb_prm_batchsize_vial_id', 'pbvi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let prm_batchsize_vial = await insertDetailedMcPrm( 'tb_prm_batchsize_vial', 'prm_batchsize_vial_id', prm_batchsize_vial_id, req.body.prm_batchsize_vial )
            
            
            // console.log('prm_batchsize_syringe_id')
            // prm_batchsize_syringe 검증 저장 준비
            // 새 prm_batchsize_syringe 검증 ID 발행받기 (DB에 저장)
            let prm_batchsize_syringe_id = await insertNewIdNumber( 'prm_batchsize_syringe_id', 'tb_prm_batchsize_syringe_id', 'pbsi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let prm_batchsize_syringe = await insertDetailedMcPrm( 'tb_prm_batchsize_syringe', 'prm_batchsize_syringe_id', prm_batchsize_syringe_id, req.body.prm_batchsize_syringe )
            
            // console.log('prm_gentlewing_id')
            // prm_gentlewing 검증 저장 준비
            // 새 prm_gentlewing 검증 ID 발행받기 (DB에 저장)
            let prm_gentlewing_id = await insertNewIdNumber( 'prm_gentlewing_id', 'tb_prm_gentlewing_id', 'pgi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_gentlewing = await insertDetailedMcPrm( 'tb_prm_gentlewing', 'prm_gentlewing_id', prm_gentlewing_id, req.body.prm_gentlewing )
            
            // console.log('prm_chopper_id')
            // prm_chopper 검증 저장 준비
            // 새 prm_chopper 검증 ID 발행받기 (DB에 저장)
            let prm_chopper_id = await insertNewIdNumber( 'prm_chopper_id', 'tb_prm_chopper_id', 'pci_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_chopper = await insertDetailedMcPrm( 'tb_prm_chopper', 'prm_chopper_id', prm_chopper_id, req.body.prm_chopper )
            
            // console.log('prm_spray_id')
            // prm_spray 검증 저장 준비
            // 새 prm_spray 검증 ID 발행받기 (DB에 저장)
            let prm_spray_id = await insertNewIdNumber( 'prm_spray_id', 'tb_prm_spray_id', 'psi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_spray = await insertDetailedMcPrm( 'tb_prm_spray', 'prm_spray_id', prm_spray_id, req.body.prm_spray )
            
            // console.log('prm_spray_kgmin_id')
            // prm_spray_kgmin 검증 저장 준비
            // 새 prm_spray_kgmin 검증 ID 발행받기 (DB에 저장)
            let prm_spray_kgmin_id = await insertNewIdNumber( 'prm_spray_kgmin_id', 'tb_prm_spray_kgmin_id', 'psrkmi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_spray_kgmin = await insertDetailedMcPrm( 'tb_prm_spray_kgmin', 'prm_spray_kgmin_id', prm_spray_kgmin_id, req.body.prm_spray_kgmin )

            // console.log('prm_spray_rpm_id')
            // prm_spray_rpm 검증 저장 준비
            // 새 prm_spray_rpm 검증 ID 발행받기 (DB에 저장)
            let prm_spray_rpm_id = await insertNewIdNumber( 'prm_spray_rpm_id', 'tb_prm_spray_rpm_id', 'psri_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_spray_rpm = await insertDetailedMcPrm( 'tb_prm_spray_rpm', 'prm_spray_rpm_id', prm_spray_rpm_id, req.body.prm_spray_rpm )
            
            // console.log('prm_gra_spray_air_id')
            // prm_spray_rpm 검증 저장 준비
            // 새 prm_spray_rpm 검증 ID 발행받기 (DB에 저장)
            let prm_gra_spray_air_id = await insertNewIdNumber( 'prm_gra_spray_air_id', 'tb_prm_gra_spray_air_id', 'pgsai_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_gra_spray_air = await insertDetailedMcPrm( 'tb_prm_gra_spray_air', 'prm_gra_spray_air_id', prm_gra_spray_air_id, req.body.prm_gra_spray_air )
            
            // console.log('prm_gra_micro_prs_id')
            // prm_spray_rpm 검증 저장 준비
            // 새 prm_spray_rpm 검증 ID 발행받기 (DB에 저장)
            let prm_gra_micro_prs_id = await insertNewIdNumber( 'prm_gra_micro_prs_id', 'tb_prm_gra_micro_prs_id', 'pgsai_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_gra_micro_prs= await insertDetailedMcPrm( 'tb_prm_gra_micro_prs', 'prm_gra_micro_prs_id', prm_gra_micro_prs_id, req.body.prm_gra_micro_prs )

            // console.log('prm_inlet_air_temp_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_inlet_air_temp_id = await insertNewIdNumber( 'prm_inlet_air_temp_id', 'tb_prm_inlet_air_temp_id', 'piati_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_inlet_air_temp = await insertDetailedMcPrm( 'tb_prm_inlet_air_temp', 'prm_inlet_air_temp_id', prm_inlet_air_temp_id, req.body.prm_inlet_air_temp )

            // console.log('prm_exh_air_temp_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_exh_air_temp_id = await insertNewIdNumber( 'prm_exh_air_temp_id', 'tb_prm_exh_air_temp_id', 'peati_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_exh_air_temp = await insertDetailedMcPrm( 'tb_prm_exh_air_temp', 'prm_exh_air_temp_id', prm_exh_air_temp_id, req.body.prm_exh_air_temp )

            // console.log('prm_inlet_air_vol_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_inlet_air_vol_id = await insertNewIdNumber( 'prm_inlet_air_vol_id', 'tb_prm_inlet_air_vol_id', 'piavi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_inlet_air_vol = await insertDetailedMcPrm( 'tb_prm_inlet_air_vol', 'prm_inlet_air_vol_id', prm_inlet_air_vol_id, req.body.prm_inlet_air_vol )

            // console.log('prm_inlet_air_vol_rpm_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_inlet_air_vol_rpm_id = await insertNewIdNumber( 'prm_inlet_air_vol_rpm_id', 'tb_prm_inlet_air_vol_rpm_id', 'piavri_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_inlet_air_vol_rpm = await insertDetailedMcPrm( 'tb_prm_inlet_air_vol_rpm', 'prm_inlet_air_vol_rpm_id', prm_inlet_air_vol_rpm_id, req.body.prm_inlet_air_vol_rpm )

            // console.log('prm_roller_gap_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_roller_gap_id = await insertNewIdNumber( 'prm_roller_gap_id', 'tb_prm_roller_gap_id', 'prgi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_roller_gap = await insertDetailedMcPrm( 'tb_prm_roller_gap', 'prm_roller_gap_id', prm_roller_gap_id, req.body.prm_roller_gap )
            
            // console.log('prm_roller_speed_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_roller_speed_id = await insertNewIdNumber( 'prm_roller_speed_id', 'tb_prm_roller_speed_id', 'prsi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_roller_speed = await insertDetailedMcPrm( 'tb_prm_roller_speed', 'prm_roller_speed_id', prm_roller_speed_id, req.body.prm_roller_speed )
            
            // console.log('prm_grate_id')
            // prm_grate 검증 저장 준비
            // 새 prm_grate 검증 ID 발행받기 (DB에 저장)
            let prm_grate_id = await insertNewIdNumber( 'prm_grate_id', 'tb_prm_grate_id', 'pgi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_grate = await insertDetailedMcPrm( 'tb_prm_grate', 'prm_grate_id', prm_grate_id, req.body.prm_grate )
            
            // console.log('prm_blendrpm_id')
            // prm_blendrpm 검증 저장 준비
            // 새 prm_blendrpm 검증 ID 발행받기 (DB에 저장)
            let prm_blendrpm_id = await insertNewIdNumber( 'prm_blendrpm_id', 'tb_prm_blendrpm_id', 'pbi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_blendrpm = await insertDetailedMcPrm( 'tb_prm_blendrpm', 'prm_blendrpm_id', prm_blendrpm_id, req.body.prm_blendrpm )
            
            
            // console.log('prm_filling_depth_id')
            // prm_blendrpm 검증 저장 준비
            // 새 prm_blendrpm 검증 ID 발행받기 (DB에 저장)
            let prm_filling_depth_id = await insertNewIdNumber( 'prm_filling_depth_id', 'tb_prm_filling_depth_id', 'pfdi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_filling_depth = await insertDetailedMcPrm( 'tb_prm_filling_depth', 'prm_filling_depth_id', prm_filling_depth_id, req.body.prm_filling_depth )
            
            // console.log('prm_cforece_id')
            // prm_cforece 검증 저장 준비
            // 새 prm_cforece 검증 ID 발행받기 (DB에 저장)
            let prm_cforece_id = await insertNewIdNumber( 'prm_cforece_id', 'tb_prm_cforece_id', 'pcfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_cforece = await insertDetailedMcPrm( 'tb_prm_cforece', 'prm_cforece_id', prm_cforece_id, req.body.prm_cforece )
            
            // console.log('prm_feeder_id')
            // prm_feeder 검증 저장 준비
            // 새 prm_feeder 검증 ID 발행받기 (DB에 저장)
            let prm_feeder_id = await insertNewIdNumber( 'prm_feeder_id', 'tb_prm_feeder_id', 'pfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_feeder = await insertDetailedMcPrm( 'tb_prm_feeder', 'prm_feeder_id', prm_feeder_id, req.body.prm_feeder )
            
            
            // console.log('prm_feeder_2nd_id')
            // prm_feeder 검증 저장 준비
            // 새 prm_feeder 검증 ID 발행받기 (DB에 저장)
            let prm_feeder_2nd_id = await insertNewIdNumber( 'prm_feeder_2nd_id', 'tb_prm_feeder_2nd_id', 'pf2i_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_feeder_2nd = await insertDetailedMcPrm( 'tb_prm_feeder_2nd', 'prm_feeder_2nd_id', prm_feeder_2nd_id, req.body.prm_feeder_2nd )
            
            // console.log('prm_turret_id')
            // prm_turret 검증 저장 준비
            // 새 prm_turret 검증 ID 발행받기 (DB에 저장)
            let prm_turret_id = await insertNewIdNumber( 'prm_turret_id', 'tb_prm_turret_id', 'pti_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_turret = await insertDetailedMcPrm( 'tb_prm_turret', 'prm_turret_id', prm_turret_id, req.body.prm_turret )
            
            // console.log('prm_pforce_id')
            // prm_pforce 검증 저장 준비
            // 새 prm_pforce 검증 ID 발행받기 (DB에 저장)
            let prm_pforce_id = await insertNewIdNumber( 'prm_pforce_id', 'tb_prm_pforce_id', 'ppfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_pforce = await insertDetailedMcPrm( 'tb_prm_pforce', 'prm_pforce_id', prm_pforce_id, req.body.prm_pforce )
            
            // console.log('prm_mforce_id')
            // prm_mforce 검증 저장 준비
            // 새 prm_mforce 검증 ID 발행받기 (DB에 저장)
            let prm_mforce_id = await insertNewIdNumber( 'prm_mforce_id', 'tb_prm_mforce_id', 'pmfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_mforce = await insertDetailedMcPrm( 'tb_prm_mforce', 'prm_mforce_id', prm_mforce_id, req.body.prm_mforce )
            
            
            // console.log('prm_pforce_2nd_id')
            // prm_mforce 검증 저장 준비
            // 새 prm_mforce 검증 ID 발행받기 (DB에 저장)
            let prm_pforce_2nd_id = await insertNewIdNumber( 'prm_pforce_2nd_id', 'tb_prm_pforce_2nd_id', 'ppf2i_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_pforce_2nd = await insertDetailedMcPrm( 'tb_prm_pforce_2nd', 'prm_pforce_2nd_id', prm_pforce_2nd_id, req.body.prm_pforce_2nd )
            
            
            // console.log('prm_mforce_2nd_id')
            // prm_mforce 검증 저장 준비
            // 새 prm_mforce 검증 ID 발행받기 (DB에 저장)
            let prm_mforce_2nd_id = await insertNewIdNumber( 'prm_mforce_2nd_id', 'tb_prm_mforce_2nd_id', 'pmf2i_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_mforce_2nd = await insertDetailedMcPrm( 'tb_prm_mforce_2nd', 'prm_mforce_2nd_id', prm_mforce_2nd_id, req.body.prm_mforce_2nd )
            
            // console.log('prm_pforce_kgf_id')
            // prm_pforce_kgf 검증 저장 준비
            // 새 prm_pforce_kgf 검증 ID 발행받기 (DB에 저장)
            let prm_pforce_kgf_id = await insertNewIdNumber( 'prm_pforce_kgf_id', 'tb_prm_pforce_kgf_id', 'ppfkgfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_pforce_kgf = await insertDetailedMcPrm( 'tb_prm_pforce_kgf', 'prm_pforce_kgf_id', prm_pforce_kgf_id, req.body.prm_pforce_kgf )
            
            // console.log('prm_mforce_kgf_id')
            // prm_mforce_kgf 검증 저장 준비
            // 새 prm_mforce_kgf 검증 ID 발행받기 (DB에 저장)
            let prm_mforce_kgf_id = await insertNewIdNumber( 'prm_mforce_kgf_id', 'tb_prm_mforce_kgf_id', 'pmfkgfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_mforce_kgf = await insertDetailedMcPrm( 'tb_prm_mforce_kgf', 'prm_mforce_kgf_id', prm_mforce_kgf_id, req.body.prm_mforce_kgf )
            
            // console.log('prm_drum_id')
            // prm_drum 검증 저장 준비
            // 새 prm_drum 검증 ID 발행받기 (DB에 저장)
            let prm_drum_id = await insertNewIdNumber( 'prm_drum_id', 'tb_prm_drum_id', 'pdi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_drum = await insertDetailedMcPrm( 'tb_prm_drum', 'prm_drum_id', prm_drum_id, req.body.prm_drum )
            
            // console.log('prm_paair_id')
            // prm_paair 검증 저장 준비
            // 새 prm_paair 검증 ID 발행받기 (DB에 저장)
            let prm_paair_id = await insertNewIdNumber( 'prm_paair_id', 'tb_prm_paair_id', 'ppai_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_paair = await insertDetailedMcPrm( 'tb_prm_paair', 'prm_paair_id', prm_paair_id, req.body.prm_paair )
            
            // console.log('prm_atair_id')
            // prm_atair 검증 저장 준비
            // 새 prm_atair 검증 ID 발행받기 (DB에 저장)
            let prm_atair_id = await insertNewIdNumber( 'prm_atair_id', 'tb_prm_atair_id', 'paai_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_atair = await insertDetailedMcPrm( 'tb_prm_atair', 'prm_atair_id', prm_atair_id, req.body.prm_atair )
            
            // console.log('prm_fill_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_fill_id = await insertNewIdNumber( 'prm_fill_id', 'tb_prm_fill_id', 'pfci_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_fill = await insertDetailedMcPrm( 'tb_prm_fill', 'prm_fill_id', prm_fill_id, req.body.prm_fill )
            
            // console.log('prm_timer_id')
            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_timer_id = await insertNewIdNumber( 'prm_timer_id', 'tb_prm_timer_id', 'pti_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_timer = await insertDetailedMcPrm( 'tb_prm_timer', 'prm_timer_id', prm_timer_id, req.body.prm_timer )

            // 새 데이터 버전 준비
            let new_data_ver = 0;
            let new_data_sub_ver = 0;
            if ( req.body.prepared_type === "NEW" ) {
                new_data_sub_ver = 1; // 신규면 data_sub_ver만 1로 설정
            } else {
                // 개정이면 data_ver을 이어받고 data_sub_ver을 1증가하여 설정
                new_data_ver = max_data_ver.data_ver
                new_data_sub_ver = max_data_ver.data_sub_ver + 1 
            }

            let gmpImpactValue = "GMP IMPACT"
            if (!req.body.gmp_impact) {
                gmpImpactValue = "NO IMPACT"
            }
            // 데이터 쿼리 준비
            let qryStr = `INSERT INTO tb_machine (
                uuid_binary,
                data_ver,
                data_sub_ver,
                approval_status,
                remark,
                revision_history,
                approval_payload_id,
                previous_approval_payload_id,
                mng_code,
                mng_code_alt,
                mng_code_alt2,
                mng_name,
                mng_team,
                machine_type,
                gmp_impact,
                not_in_use,
                periodic_mng_1y_qual,
                periodic_mng_qual,
                periodic_mng_ster,
                periodic_mng_vhp,
                periodic_mng_review,
                periodic_mng_cv,
                periodic_mng_1y_mt,
                periodic_mng_mt,
                periodic_mng_season_mt,
                mc_periodic_1y_qual_id,
                mc_periodic_qual_id,
                mc_periodic_ster_id,
                mc_periodic_vhp_id,
                mc_periodic_review_id,
                mc_iq_id,
                mc_oq_id,
                mc_pq_id,
                mc_periodic_cv_id,
                mc_cv_id,
                mc_periodic_1y_mt_id,
                mc_periodic_mt_id,
                mc_periodic_season_mt_id,
                mc_mt_id,
                prm_list_id,
                prm_batchsize_id,
                prm_batchsize_kg_id,
                prm_batchsize_vial_id,
                prm_batchsize_syringe_id,
                prm_gentlewing_id,
                prm_chopper_id,
                prm_spray_id,
                prm_spray_kgmin_id,
                prm_spray_rpm_id,
                prm_gra_spray_air_id,
                prm_gra_micro_prs_id,
                prm_inlet_air_temp_id,
                prm_exh_air_temp_id,
                prm_inlet_air_vol_id,
                prm_inlet_air_vol_rpm_id,
                prm_roller_speed_id,
                prm_roller_gap_id,
                prm_grate_id,
                prm_blendrpm_id,
                prm_filling_depth_id,
                prm_cforece_id,
                prm_feeder_id,
                prm_feeder_2nd_id,
                prm_turret_id,
                prm_pforce_id,
                prm_mforce_id,
                prm_pforce_2nd_id,
                prm_mforce_2nd_id,
                prm_pforce_kgf_id,
                prm_mforce_kgf_id,
                prm_drum_id,
                prm_paair_id,
                prm_atair_id,
                prm_fill_id,
                prm_timer_id
            )
            VALUES (
                UUID_TO_BIN(UUID()),
                ${new_data_ver},
                ${new_data_sub_ver},
                'PREPARED',
                NULL,
                '${req.body.revision_history}',
                '${approval_payload_id}',
                '${req.body.previous_approval_payload_id}',
                '${req.body.mng_code}',
                '${req.body.mng_code_alt}',
                '${req.body.mng_code_alt2}',
                '${req.body.mng_name}',
                '${req.body.mng_team}',
                '${req.body.machine_type}',
                '${gmpImpactValue}',
                '${req.body.not_in_use}',
                ${req.body.periodic_mng_1y_qual},
                ${req.body.periodic_mng_qual},
                ${req.body.periodic_mng_ster},
                ${req.body.periodic_mng_vhp},
                ${req.body.periodic_mng_review},
                ${req.body.periodic_mng_cv},
                ${req.body.periodic_mng_1y_mt},
                ${req.body.periodic_mng_mt},
                ${req.body.periodic_mng_season_mt},
                '${mc_periodic_1y_qual_id}',
                '${mc_periodic_qual_id}',
                '${mc_periodic_ster_id}',
                '${mc_periodic_vhp_id}',
                '${mc_periodic_review_id}',
                '${mc_iq_id}',
                '${mc_oq_id}',
                '${mc_pq_id}',
                '${mc_periodic_cv_id}',
                '${mc_cv_id}',
                '${mc_periodic_1y_mt_id}',
                '${mc_periodic_mt_id}',
                '${mc_periodic_season_mt_id}',
                '${mc_mt_id}',
                '${prm_list_id}',
                '${prm_batchsize_id}',
                '${prm_batchsize_kg_id}',
                '${prm_batchsize_vial_id}',
                '${prm_batchsize_syringe_id}',
                '${prm_gentlewing_id}',
                '${prm_chopper_id}',
                '${prm_spray_id}',
                '${prm_spray_kgmin_id}',
                '${prm_spray_rpm_id}',
                '${prm_gra_spray_air_id}',
                '${prm_gra_micro_prs_id}',
                '${prm_inlet_air_temp_id}',
                '${prm_exh_air_temp_id}',
                '${prm_inlet_air_vol_id}',
                '${prm_inlet_air_vol_rpm_id}',
                '${prm_roller_speed_id}',
                '${prm_roller_gap_id}',
                '${prm_grate_id}',
                '${prm_blendrpm_id}',
                '${prm_filling_depth_id}',
                '${prm_cforece_id}',
                '${prm_feeder_id}',
                '${prm_feeder_2nd_id}',
                '${prm_turret_id}',
                '${prm_pforce_id}',
                '${prm_mforce_id}',
                '${prm_pforce_2nd_id}',
                '${prm_mforce_2nd_id}',
                '${prm_pforce_kgf_id}',
                '${prm_mforce_kgf_id}',
                '${prm_drum_id}',
                '${prm_paair_id}',
                '${prm_atair_id}',
                '${prm_fill_id}',
                '${prm_timer_id}'               
            )`.replace(/\n/g, "")

            let qryRs = await sendQry(qryStr)
            .then((rs) => {
                
            })
            .catch((error) => {
                console.log(error)
                res.status(512).json(addMachineMsg.elecSignFail.dbFail)
            })

            if ( req.body.immediate_effective ) {
                await updateApprovalPayloadFinish(approval_payload_id) // 결재라인 완료 처리 (done_datetime 컬럼값 업데이트) 
                .then( async ( rs ) => {
                    let preparedType = await selectPreparedType(approval_payload_id)
                    let approvalStr="APPROVED"
                    // console.log(preparedType.prepared_type)
                    if ( preparedType.prepared_type == 'VOID') {
                        approvalStr = 'VOID'
                    }
                    await updateApprovalStatus('tb_machine', approval_payload_id, approvalStr, 1) // 결재진행한 데이터 승인상태 (approval_status 컬럼값) 업데이트
                    .then( async ( rs ) => {
                        await updateOldApproved('tb_machine', approval_payload_id) // 이전 승인 본 VOID 처리 (모든 결재건은 이전 승인본의 approval_payload_id를 가져야함)
                        .then( async ( rs ) => {
                            res.status(200).json(addMachineMsg.elecSignSuccess)
                        })
                        .catch(( error ) => {
                            res.status(512).json(addMachineMsg.elecSignFail.dbFail)
                        })
                    })
                    .catch(( error ) => {
                        console.log(error)
                        res.status(512).json(addMachineMsg.elecSignFail.dbFail)
                    })
                })
                .catch(( error ) => {
                    console.log(error)
                    res.status(512).json(addMachineMsg.elecSignFail.dbFail)
                })
            } else {
                res.status(200).json(addMachineMsg.addSuccess)
            }
        }
    })

}

module.exports = addMachine;