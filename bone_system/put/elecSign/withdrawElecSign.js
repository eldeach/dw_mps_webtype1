// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');
const selectPwCompare = require ('../../dbTransComponent/dbSelect/selectPwCompare')
const selectPreparedYet = require('./dbTransComponent/dbSelect/selectPreparedYet')
const updateApprovalPayloadFinish = require('./dbTransComponent/dbUpdate/updateApprovalPayloadFinish')
const updateApprovalStatus = require('./dbTransComponent/dbUpdate/updateApprovalStatus')

//Object
const withdrawElecSignMsg = require('./withdrawElecSignMsg')

async function withdrawElecSign (app) {
    app.put('/withdrawelecsign', async function (req, res) {

        let preparedYet = await selectPreparedYet(req.body.tbl_name, req.body.approval_payload_id) // 아직도 PREPARED 상태인지 확인
        let pwCompare = await selectPwCompare(req.user, req.body.user_pw) // 전자서명 체크
        if ( req.user !== req.body.user_account) { // 전자서명 실패
            res.status(452).json(withdrawElecSignMsg.elecSignFail.notYours)
        } else if ( !pwCompare ) { // 전자서명 실패
            res.status(452).json(withdrawElecSignMsg.elecSignFail.wrongPW)
        } else if ( !preparedYet || preparedYet.length < 1) {
            res.status(452).json(withdrawElecSignMsg.elecSignFail.notPrepared)
        } else {
            await updateApprovalStatus(req.body.tbl_name, req.body.approval_payload_id, 'WITHDRAWN', 0) // 결재진행한 데이터 승인상태 (approval_status 컬럼값) 업데이트
            .then( async ( rs ) => {
                await updateApprovalPayloadFinish(req.body.approval_payload_id) // 결재라인 완료 처리 (done_datetime 컬럼값 업데이트) 
                .then( async ( rs ) => {
                    res.status(200).json(withdrawElecSignMsg.elecSignSuccess)
                })
                .catch(( error ) => {
                    console.log(error)
                    res.status(512).json(withdrawElecSignMsg.elecSignFail.dbFail)
                })
            })
            .catch(( error ) => {
                console.log(error)
                res.status(512).json(withdrawElecSignMsg.elecSignFail.dbFail)
            })
        }
    })
}

module.exports = withdrawElecSign;