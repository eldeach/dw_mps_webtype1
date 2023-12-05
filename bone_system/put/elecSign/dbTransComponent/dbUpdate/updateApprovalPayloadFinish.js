// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');

async function updateApprovalPayloadFinish (approval_payload_id) {
    // 특정 테이블에 귀속되면 안됨
    // tb_approval_payload 테이블에 approval_payload_id 값만 사용해서 결재라인 종료일을 기록해야함
    await sendQry(`
        UPDATE tb_approval_payload_id
        SET
            done_datetime = NOW()
        WHERE
        approval_payload_id = '${approval_payload_id}'
    `)
    .then( async ( rs ) => {
        return rs
    })
    .catch(( error ) => {
        console.log(error)
        return error
    })
}

module.exports = updateApprovalPayloadFinish;