// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require('../../../../dbconns/maria/thisdb');

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
const addProductMsg = require('./addProductMsg');

// its components - dbInsert
const insertDetailedProdDoc = require('./insertSubRecord/insertDetailedProdDoc')


async function addProduct(app) {
    app.post('/addproduct', async function (req, res) {
        let duplicatedPk = await selectPkValueExist('tb_prod', 'mng_code', req.body.mng_code) // 중복된 PK 값이 이미 있는지 (NEW 타입인 경우 막을 목적)

        let max_data_ver = await selectPkMaxVer('tb_prod', 'mng_code', req.body.mng_code) // 해당 PK의 최대 데이터 버전 확인
        let sumbitPossible = await selectSubmitPossibleCheck(max_data_ver, 'tb_prod', 'mng_code', req.body.mng_code) // 해당 PK의 최대 데이터 버전의 레코드 승인상태 확인


        let revisionPossible = false
        if (sumbitPossible.length > 0) {
            // 최대 버전을 가진 레코드의 승인상태가 'PREPARED', 'UNDER_APPROVAL' 둘 다 아닌경우 true
            revisionPossible = !(sumbitPossible[0].approval_status == 'PREPARED' || sumbitPossible[0].approval_status == 'UNDER_APPROVAL')
        } else {
            // 해당 PK의 최대 데이터 버전의 레코드가 없다는 뜻이기 때문에 true (사실 해당 PK값을 가진 레코드가 없기 때문)
            revisionPossible = true
        }

        if (duplicatedPk && req.body.prepared_type === "NEW") { // 새로운 데이터 추가인데 중복된 경우 걸러주기
            res.status(452).json(addProductMsg.addFail.duplicated)
        } else if (!revisionPossible) { // 개정인 경우 진행 중인 건이 이미 있으면 걸러주기 (NEW 타입인 경우 이미 위에서 거른 걸로 OK인 상황)
            res.status(452).json(addProductMsg.addFail.alreadyInProgress)
        } else {
            // console.log('approval_payload_id')
            // 결재라인 준비
            // 새 결재라인 ID 발행받기 (DB에 저장)
            let approval_payload_id = await insertNewApprovalId('tb_prod', 'avm', 'Product (제품)', 'AVM', req.body.prepared_type, req.user)
            // 새로 발행받은 결재라인 ID로 결재라인 정보 DB에 저장하기
            let apStoreRs = await insertNewApprovalPayload(approval_payload_id, req.body.approval_payload)

            // console.log('prod_periodic_pv_id')
            // 정기적 PV 저장 준비
            // 새 PV 목록 ID 발행받기 (DB에 저장)
            let prod_periodic_pv_id = await insertNewIdNumber('prod_periodic_pv_id', 'tb_prod_periodic_pv_id', 'pppvi_')
            // 새로 받은 PV 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prod_periodic_pv = await insertDetailedProdDoc('tb_prod_periodic_pv', 'prod_periodic_pv_id', prod_periodic_pv_id, req.body.prod_periodic_pv)

            // console.log('mc_periodic_qual_id')
            // 정기적 재적격성 평가 저장 준비
            // 새 정기적 재적격성 평가 목록 ID 발행받기 (DB에 저장)
            let prod_pv_id = await insertNewIdNumber('prod_pv_id', 'tb_prod_pv_id', 'ppvi_')
            // 새로 받은 정기적 재적격성 평가 목록 ID로 DB에 저장하기
            let rsDetailed_prod_pv = await insertDetailedProdDoc('tb_prod_pv', 'prod_pv_id', prod_pv_id, req.body.prod_pv)

            // 새 데이터 버전 준비
            let new_data_ver = 0;
            let new_data_sub_ver = 0;
            if (req.body.prepared_type === "NEW") {
                new_data_sub_ver = 1; // 신규면 data_sub_ver만 1로 설정
            } else {
                // 개정이면 data_ver을 이어받고 data_sub_ver을 1증가하여 설정
                new_data_ver = max_data_ver.data_ver
                new_data_sub_ver = max_data_ver.data_sub_ver + 1
            }

            // 데이터 쿼리 준비
            let qryStr = `INSERT INTO tb_prod (
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
                periodic_mng_pv,
                prod_periodic_pv_id,
                prod_pv_id
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
                ${req.body.periodic_mng_pv},
                '${prod_periodic_pv_id}',
                '${prod_pv_id}'          
            )`.replace(/\n/g, "")

            let qryRs = await sendQry(qryStr)
                .then((rs) => {

                })
                .catch((error) => {
                    console.log(error)
                    res.status(512).json(addProductMsg.elecSignFail.dbFail)
                })

            if (req.body.immediate_effective) {
                await updateApprovalPayloadFinish(approval_payload_id) // 결재라인 완료 처리 (done_datetime 컬럼값 업데이트) 
                    .then(async (rs) => {
                        let preparedType = await selectPreparedType(approval_payload_id)
                        let approvalStr = "APPROVED"
                        // console.log(preparedType.prepared_type)
                        if (preparedType.prepared_type == 'VOID') {
                            approvalStr = 'VOID'
                        }
                        await updateApprovalStatus('tb_prod', approval_payload_id, approvalStr, 1) // 결재진행한 데이터 승인상태 (approval_status 컬럼값) 업데이트
                            .then(async (rs) => {
                                await updateOldApproved('tb_prod', approval_payload_id) // 이전 승인 본 VOID 처리 (모든 결재건은 이전 승인본의 approval_payload_id를 가져야함)
                                    .then(async (rs) => {
                                        res.status(200).json(addProductMsg.elecSignSuccess)
                                    })
                                    .catch((error) => {
                                        res.status(512).json(addProductMsg.elecSignFail.dbFail)
                                    })
                            })
                            .catch((error) => {
                                console.log(error)
                                res.status(512).json(addProductMsg.elecSignFail.dbFail)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(512).json(addProductMsg.elecSignFail.dbFail)
                    })
            } else {
                res.status(200).json(addProductMsg.addSuccess)
            }
        }
    })

}

module.exports = addProduct;