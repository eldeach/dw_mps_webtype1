// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');

// bone_system
// dbSelect
const selectPkValueExist = require('../../../bone_system/dbTransComponent/dbSelect/selectPkValueExist')
const selectPkMaxVer = require('../../../bone_system/dbTransComponent/dbSelect/selectPkMaxVer')
const selectSubmitPossibleCheck = require('../../../bone_system/dbTransComponent/dbSelect/selectSubmitPossibleCheck')
// dbInsert
const insertNewApprovalPayload = require('../../../bone_system/dbTransComponent/dbInsert/insertNewApprovalPayload');
const insertNewApprovalId = require('../../../bone_system/dbTransComponent/dbInsert/insertNewApprovalId');
const insertNewIdNumber = require('../../../bone_system/dbTransComponent/dbInsert/insertNewIdNumber');

//elecSign
//dbselect
const selectPreparedType = require('../../../bone_system/put/elecSign/dbTransComponent/dbSelect/selectPreparedType')
//dbUpdate
const updateApprovalPayloadFinish = require('../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateApprovalPayloadFinish')
const updateApprovalStatus = require('../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateApprovalStatus')
const updateOldApproved = require('../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateOldApproved')

// its Object
const addMachineMsg = require('./addMachineMsg');

// its components - dbInsert
const insertDetailedMcDoc = require('./insertSubRecord/insertDetailedMcDoc')
const insertDetailedMcPrm = require('./insertSubRecord/insertDetailedMcPrm')


async function addMachine ( app ) {
    app.post('/addmachine', async function( req, res ) {
        console.log(req.body)
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
            // 결재라인 준비
            // 새 결재라인 ID 발행받기 (DB에 저장)
            let approval_payload_id = await insertNewApprovalId('tb_machine', 'avm', 'Machine System (설비 시스템)', 'AVM', req.body.prepared_type, req.user )
            // 새로 발행받은 결재라인 ID로 결재라인 정보 DB에 저장하기
            let apStoreRs = await insertNewApprovalPayload(approval_payload_id, req.body.approval_payload)

            // 정기적 재적격성 평가 저장 준비
            // 새 정기적 재적격성 평가 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_qual_id = await insertNewIdNumber( 'mc_periodic_qual_id', 'tb_mc_periodic_qual_id', 'mpqi_' )
            console.log(mc_periodic_qual_id)
            // 새로 받은 정기적 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_qual = await insertDetailedMcDoc( 'tb_mc_periodic_qual', 'mc_periodic_qual_id', mc_periodic_qual_id, req.body.mc_periodic_qual )
            
            // 정기적 멸균 재적격성 평가 저장 준비
            // 새 정기적 멸균 재적격성 평가 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_ster_id = await insertNewIdNumber( 'mc_periodic_ster_id', 'tb_mc_periodic_ster_id', 'mpsi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_ster = await insertDetailedMcDoc( 'tb_mc_periodic_ster', 'mc_periodic_ster_id', mc_periodic_ster_id, req.body.mc_periodic_ster )

            // 정기적 점검 저장 준비
            // 새 정기적 점검 목록 ID 발행받기 (DB에 저장)
            let mc_periodic_review_id = await insertNewIdNumber( 'mc_periodic_review_id', 'tb_mc_periodic_review_id', 'mpri_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_review = await insertDetailedMcDoc( 'tb_mc_periodic_review', 'mc_periodic_review_id', mc_periodic_review_id, req.body.mc_periodic_review )

            // IQ 저장 준비
            // 새 IQ ID 발행받기 (DB에 저장)
            let mc_iq_id = await insertNewIdNumber( 'mc_iq_id', 'tb_mc_iq_id', 'miqi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_iq = await insertDetailedMcDoc( 'tb_mc_iq', 'mc_iq_id', mc_iq_id, req.body.mc_iq )

            // OQ 저장 준비
            // 새 OQ ID 발행받기 (DB에 저장)
            let mc_oq_id = await insertNewIdNumber( 'mc_oq_id', 'tb_mc_oq_id', 'moqi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_oq = await insertDetailedMcDoc( 'tb_mc_oq', 'mc_oq_id', mc_oq_id, req.body.mc_oq )

            // PQ 저장 준비
            // 새 PQ ID 발행받기 (DB에 저장)
            let mc_pq_id = await insertNewIdNumber( 'mc_pq_id', 'tb_mc_pq_id', 'mpqi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_pq = await insertDetailedMcDoc( 'tb_mc_pq', 'mc_pq_id', mc_pq_id, req.body.mc_pq )

            // Periodic CV 저장 준비
            // 새 Periodic CV ID 발행받기 (DB에 저장)
            let mc_periodic_cv_id = await insertNewIdNumber( 'mc_periodic_cv_id', 'tb_mc_periodic_cv_id', 'mpci_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_cv = await insertDetailedMcDoc( 'tb_mc_periodic_cv', 'mc_periodic_cv_id', mc_periodic_cv_id, req.body.mc_periodic_cv )

            // mc_cv 저장 준비
            // 새 mc_cv ID 발행받기 (DB에 저장)
            let mc_cv_id = await insertNewIdNumber( 'mc_cv_id', 'tb_mc_cv_id', 'mcvi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_cv = await insertDetailedMcDoc( 'tb_mc_cv', 'mc_cv_id', mc_cv_id, req.body.mc_cv )

            // Periodic Mapping 저장 준비
            // 새 Periodic Mapping ID 발행받기 (DB에 저장)
            let mc_periodic_mt_id = await insertNewIdNumber( 'mc_periodic_mt_id', 'tb_mc_periodic_mt_id', 'mpmi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_periodic_mt = await insertDetailedMcDoc( 'tb_mc_periodic_mt', 'mc_periodic_mt_id', mc_periodic_mt_id, req.body.mc_periodic_mt )

            // mc_mt 저장 준비
            // 새 mc_mt ID 발행받기 (DB에 저장)
            let mc_mt_id = await insertNewIdNumber( 'mc_mt_id', 'tb_mc_mt_id', 'mmti_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_mc_mt = await insertDetailedMcDoc( 'tb_mc_mt', 'mc_mt_id', mc_mt_id, req.body.mc_mt )


            // prm_list 저장 준비
            // 새 prm_list ID 발행받기 (DB에 저장)
            let prm_list_id = await insertNewIdNumber( 'prm_list_id', 'tb_prm_list_id', 'plisti_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            // let rsDetailed_prm_list = await insertDetailedMcPrmList( 'tb_prm_list', 'prm_list_id', prm_list_id, req.body.prm_list )
            
            // prm_bathsize 검증 저장 준비
            // 새 prm_bathsize 검증 ID 발행받기 (DB에 저장)
            let prm_bathsize_id = await insertNewIdNumber( 'prm_bathsize_id', 'tb_prm_bathsize_id', 'pbi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_bathsize = await insertDetailedMcPrm( 'tb_prm_bathsize', 'prm_bathsize_id', prm_bathsize_id, req.body.prm_bathsize )

            // prm_gentlewing 검증 저장 준비
            // 새 prm_gentlewing 검증 ID 발행받기 (DB에 저장)
            let prm_gentlewing_id = await insertNewIdNumber( 'prm_gentlewing_id', 'tb_prm_gentlewing_id', 'pgi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_gentlewing = await insertDetailedMcPrm( 'tb_prm_gentlewing', 'prm_gentlewing_id', prm_gentlewing_id, req.body.prm_gentlewing )

            // prm_chopper 검증 저장 준비
            // 새 prm_chopper 검증 ID 발행받기 (DB에 저장)
            let prm_chopper_id = await insertNewIdNumber( 'prm_chopper_id', 'tb_prm_chopper_id', 'pci_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_chopper = await insertDetailedMcPrm( 'tb_prm_chopper', 'prm_chopper_id', prm_chopper_id, req.body.prm_chopper )

            // prm_spray 검증 저장 준비
            // 새 prm_spray 검증 ID 발행받기 (DB에 저장)
            let prm_spray_id = await insertNewIdNumber( 'prm_spray_id', 'tb_prm_spray_id', 'psi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_spray = await insertDetailedMcPrm( 'tb_prm_spray', 'prm_spray_id', prm_spray_id, req.body.prm_spray )

            // prm_spray_rpm 검증 저장 준비
            // 새 prm_spray_rpm 검증 ID 발행받기 (DB에 저장)
            let prm_spray_rpm_id = await insertNewIdNumber( 'prm_spray_rpm_id', 'tb_prm_spray_rpm_id', 'psri_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_spray_rpm = await insertDetailedMcPrm( 'tb_prm_spray_rpm', 'prm_spray_rpm_id', prm_spray_rpm_id, req.body.prm_spray_rpm )

            // prm_grate 검증 저장 준비
            // 새 prm_grate 검증 ID 발행받기 (DB에 저장)
            let prm_grate_id = await insertNewIdNumber( 'prm_grate_id', 'tb_prm_grate_id', 'pgi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_grate = await insertDetailedMcPrm( 'tb_prm_grate', 'prm_grate_id', prm_grate_id, req.body.prm_grate )

            // prm_blendrpm 검증 저장 준비
            // 새 prm_blendrpm 검증 ID 발행받기 (DB에 저장)
            let prm_blendrpm_id = await insertNewIdNumber( 'prm_blendrpm_id', 'tb_prm_blendrpm_id', 'pbi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_blendrpm = await insertDetailedMcPrm( 'tb_prm_blendrpm', 'prm_blendrpm_id', prm_blendrpm_id, req.body.prm_blendrpm )

            // prm_cforece 검증 저장 준비
            // 새 prm_cforece 검증 ID 발행받기 (DB에 저장)
            let prm_cforece_id = await insertNewIdNumber( 'prm_cforece_id', 'tb_prm_cforece_id', 'pcfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_cforece = await insertDetailedMcPrm( 'tb_prm_cforece', 'prm_cforece_id', prm_cforece_id, req.body.prm_cforece )

            // prm_feeder 검증 저장 준비
            // 새 prm_feeder 검증 ID 발행받기 (DB에 저장)
            let prm_feeder_id = await insertNewIdNumber( 'prm_feeder_id', 'tb_prm_feeder_id', 'pfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_feeder = await insertDetailedMcPrm( 'tb_prm_feeder', 'prm_feeder_id', prm_feeder_id, req.body.prm_feeder )

            // prm_turret 검증 저장 준비
            // 새 prm_turret 검증 ID 발행받기 (DB에 저장)
            let prm_turret_id = await insertNewIdNumber( 'prm_turret_id', 'tb_prm_turret_id', 'pti_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_turret = await insertDetailedMcPrm( 'tb_prm_turret', 'prm_turret_id', prm_turret_id, req.body.prm_turret )

            // prm_pforce 검증 저장 준비
            // 새 prm_pforce 검증 ID 발행받기 (DB에 저장)
            let prm_pforce_id = await insertNewIdNumber( 'prm_pforce_id', 'tb_prm_pforce_id', 'ppfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_pforce = await insertDetailedMcPrm( 'tb_prm_pforce', 'prm_pforce_id', prm_pforce_id, req.body.prm_pforce )

            // prm_mforce 검증 저장 준비
            // 새 prm_mforce 검증 ID 발행받기 (DB에 저장)
            let prm_mforce_id = await insertNewIdNumber( 'prm_mforce_id', 'tb_prm_mforce_id', 'pmfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_mforce = await insertDetailedMcPrm( 'tb_prm_mforce', 'prm_mforce_id', prm_mforce_id, req.body.prm_mforce )

            // prm_pforce_kgf 검증 저장 준비
            // 새 prm_pforce_kgf 검증 ID 발행받기 (DB에 저장)
            let prm_pforce_kgf_id = await insertNewIdNumber( 'prm_pforce_kgf_id', 'tb_prm_pforce_kgf_id', 'ppfkgfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_pforce_kgf = await insertDetailedMcPrm( 'tb_prm_pforce_kgf', 'prm_pforce_kgf_id', prm_pforce_kgf_id, req.body.prm_pforce_kgf )

            // prm_mforce_kgf 검증 저장 준비
            // 새 prm_mforce_kgf 검증 ID 발행받기 (DB에 저장)
            let prm_mforce_kgf_id = await insertNewIdNumber( 'prm_mforce_kgf_id', 'tb_prm_mforce_kgf_id', 'pmfkgfi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_mforce_kgf = await insertDetailedMcPrm( 'tb_prm_mforce_kgf', 'prm_mforce_kgf_id', prm_mforce_kgf_id, req.body.prm_mforce_kgf )

            // prm_drum 검증 저장 준비
            // 새 prm_drum 검증 ID 발행받기 (DB에 저장)
            let prm_drum_id = await insertNewIdNumber( 'prm_drum_id', 'tb_prm_drum_id', 'pdi_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_drum = await insertDetailedMcPrm( 'tb_prm_drum', 'prm_drum_id', prm_drum_id, req.body.prm_drum )

            // prm_paair 검증 저장 준비
            // 새 prm_paair 검증 ID 발행받기 (DB에 저장)
            let prm_paair_id = await insertNewIdNumber( 'prm_paair_id', 'tb_prm_paair_id', 'ppai_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_paair = await insertDetailedMcPrm( 'tb_prm_paair', 'prm_paair_id', prm_paair_id, req.body.prm_paair )

            // prm_atair 검증 저장 준비
            // 새 prm_atair 검증 ID 발행받기 (DB에 저장)
            let prm_atair_id = await insertNewIdNumber( 'prm_atair_id', 'tb_prm_atair_id', 'paai_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_atair = await insertDetailedMcPrm( 'tb_prm_atair', 'prm_atair_id', prm_atair_id, req.body.prm_atair )

            // prm_fill 검증 저장 준비
            // 새 prm_fill 검증 ID 발행받기 (DB에 저장)
            let prm_fill_id = await insertNewIdNumber( 'prm_fill_id', 'tb_prm_fill_id', 'pfci_' )
            // 새로 받은 정기적 멸균 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prm_fill = await insertDetailedMcPrm( 'tb_prm_fill', 'prm_fill_id', prm_fill_id, req.body.prm_fill )

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
                mc_periodic_qual_id,
                mc_periodic_ster_id,
                mc_periodic_review_id,
                mc_iq_id,
                mc_oq_id,
                mc_pq_id,
                mc_periodic_cv_id,
                mc_cv_id,
                mc_periodic_mt_id,
                mc_mt_id,
                prm_list_id,
                prm_bathsize_id,
                prm_gentlewing_id,
                prm_chopper_id,
                prm_spray_id,
                prm_spray_rpm_id,
                prm_grate_id,
                prm_blendrpm_id,
                prm_cforece_id,
                prm_feeder_id,
                prm_turret_id,
                prm_pforce_id,
                prm_mforce_id,
                prm_pforce_kgf_id,
                prm_mforce_kgf_id,
                prm_drum_id,
                prm_paair_id,
                prm_atair_id,
                prm_fill_id
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
                '${mc_periodic_qual_id}',
                '${mc_periodic_ster_id}',
                '${mc_periodic_review_id}',
                '${mc_iq_id}',
                '${mc_oq_id}',
                '${mc_pq_id}',
                '${mc_periodic_cv_id}',
                '${mc_cv_id}',
                '${mc_periodic_mt_id}',
                '${mc_mt_id}',
                '${prm_list_id}',
                '${prm_bathsize_id}',
                '${prm_gentlewing_id}',
                '${prm_chopper_id}',
                '${prm_spray_id}',
                '${prm_spray_rpm_id}',
                '${prm_grate_id}',
                '${prm_blendrpm_id}',
                '${prm_cforece_id}',
                '${prm_feeder_id}',
                '${prm_turret_id}',
                '${prm_pforce_id}',
                '${prm_mforce_id}',
                '${prm_pforce_kgf_id}',
                '${prm_mforce_kgf_id}',
                '${prm_drum_id}',
                '${prm_paair_id}',
                '${prm_atair_id}',
                '${prm_fill_id}'               
            )`.replace(/\n/g, "")

            console.log(qryStr)

            let qryRs = await sendQry(qryStr)

            if ( req.body.immediate_effective ) {
                await updateApprovalPayloadFinish(approval_payload_id) // 결재라인 완료 처리 (done_datetime 컬럼값 업데이트) 
                .then( async ( rs ) => {
                    let preparedType = await selectPreparedType(approval_payload_id)
                    let approvalStr="APPROVED"
                    console.log(preparedType.prepared_type)
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
            }
        }
    })

}

module.exports = addMachine;