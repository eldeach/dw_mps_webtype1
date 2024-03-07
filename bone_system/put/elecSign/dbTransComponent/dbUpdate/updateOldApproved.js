// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


/**
    * @version 1.0.0
    * @params {string} tbl_name 레코드가 기록되는 테이블 명
    * @params {string} approval_payload_id 레코드가 가진 approval_payload_id
    * @returns {string} DB update 결과 return
 */


async function updateOldApproved(tbl_name, approval_payload_id) {
    let rs = await sendQry(`
        UPDATE ${tbl_name}
        SET approval_status = 'VOID'
        WHERE approval_payload_id = (SELECT previous_approval_payload_id FROM ${tbl_name} WHERE approval_payload_id = '${approval_payload_id}')
    `)

    return rs;
}

module.exports = updateOldApproved;

