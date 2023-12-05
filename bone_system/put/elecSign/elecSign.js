// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');
const selectPwCompare = require ('../../dbTransComponent/dbSelect/selectPwCompare')
const selectRestPeronssel = require('./dbTransComponent/dbSelect/selectRestPeronssel')
const selectPreparedType = require('./dbTransComponent/dbSelect/selectPreparedType')
const updateApprovalPayloadFinish = require('./dbTransComponent/dbUpdate/updateApprovalPayloadFinish')
const updateApprovalStatus = require('./dbTransComponent/dbUpdate/updateApprovalStatus')
const updateOldApproved = require('./dbTransComponent/dbUpdate/updateOldApproved')
//Object
const elecSignMsg = require('./elecSignMsg')

async function elecSign (app) {
    app.put('/elecsign', async function (req, res) {

        let restPersonnel = await selectRestPeronssel(req.body.approval_payload_id, req.user)

        let pwCompare = await selectPwCompare(req.user, req.body.user_pw) // 전자서명 체크

        if ( req.user !== req.body.user_account) { // 전자서명 실패
            res.status(452).json(elecSignMsg.elecSignFail.notYours)
        } else if ( !pwCompare ) { // 전자서명 실패
            res.status(452).json(elecSignMsg.elecSignFail.wrongPW)
        } else {
            // tb_approval_payload에 결재라인 중 사용자의 것에 전자서명 기록
            let rs = await sendQry(`
            UPDATE
                tb_approval_payload
            SET
                chosen_approval = ${req.body.chosen_approval}, approval_date_time = NOW(), user_comment = '${req.body.user_comment}'
            WHERE
                approval_payload_id = '${req.body.approval_payload_id}' AND user_account = '${req.user}'
            `)
            .then( async ( rs ) => {
                // 결재라인 payload 처리 시작
                if ( req.body.chosen_approval === 0 ) { // 결재의견이 Reject인 경우
                    await updateApprovalPayloadFinish(req.body.approval_payload_id) // 결재라인 완료 처리 (done_datetime 컬럼값 업데이트)
                    .then( async ( rs ) => {
                        await updateApprovalStatus(req.body.tbl_name, req.body.approval_payload_id, 'REJECTED', 0) // 결재진행한 데이터 승인상태 (approval_status 컬럼값) 업데이트
                        .then( async ( rs ) => {
                            res.status(200).json(elecSignMsg.elecSignSuccess)
                        })
                        .catch(( error ) => {
                            console.log(error)
                            res.status(512).json(elecSignMsg.elecSignFail.dbFail)
                        })
                    })
                    .catch(( error ) => {
                        console.log(error)
                        res.status(512).json(elecSignMsg.elecSignFail.dbFail)
                    })
                } else {
                    if ( restPersonnel > 0) { // 마지막 승인자가 아닐 경우
                        await updateApprovalStatus(req.body.tbl_name, req.body.approval_payload_id, 'UNDER_APPROVAL', 0) // 결재진행한 데이터 승인상태 (approval_status 컬럼값) 업데이트
                        .then( async ( rs ) => {
                            res.status(200).json(elecSignMsg.elecSignSuccess)
                        })
                        .catch(( error ) => {
                            console.log(error)
                            res.status(512).json(elecSignMsg.elecSignFail.dbFail)
                        })
                    } else { // 마지막 승인자일 경우
                        await updateApprovalPayloadFinish(req.body.approval_payload_id) // 결재라인 완료 처리 (done_datetime 컬럼값 업데이트) 
                        .then( async ( rs ) => {
                            let preparedType = await selectPreparedType(req.body.approval_payload_id)
                            let approvalStr="APPROVED"
                            console.log(preparedType.prepared_type)
                            if ( preparedType.prepared_type == 'VOID') {
                                approvalStr = 'VOID'
                            }
                            await updateApprovalStatus(req.body.tbl_name, req.body.approval_payload_id, approvalStr, 1) // 결재진행한 데이터 승인상태 (approval_status 컬럼값) 업데이트 - 지금 void 승인완료인경우가 고려 안된것 같음
                            .then( async ( rs ) => {
                                await updateOldApproved(req.body.tbl_name, req.body.approval_payload_id) // 이전 승인 본 VOID 처리 (모든 결재건은 이전 승인본의 approval_payload_id를 가져야함)
                                .then( async ( rs ) => {
                                    res.status(200).json(elecSignMsg.elecSignSuccess)
                                })
                                .catch(( error ) => {
                                    res.status(512).json(elecSignMsg.elecSignFail.dbFail)
                                })
                            })
                            .catch(( error ) => {
                                console.log(error)
                                res.status(512).json(elecSignMsg.elecSignFail.dbFail)
                            })
                        })
                        .catch(( error ) => {
                            console.log(error)
                            res.status(512).json(elecSignMsg.elecSignFail.dbFail)
                        })
                    }
                }
            })
            .catch(( error ) => {
                console.log(error)
                res.status(512).json(elecSignMsg.elecSignFail.dbFail)
            })
        }
    })
}

module.exports = elecSign;