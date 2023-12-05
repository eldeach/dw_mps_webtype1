// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');

async function updateOldApproved(tbl_name, approval_payload_id) {
    let rs = await sendQry(`
        UPDATE ${tbl_name}
        SET approval_status = 'VOID'
        WHERE approval_payload_id = (SELECT previous_approval_payload_id FROM tb_user WHERE approval_payload_id = '${approval_payload_id}')
    `)

    return rs;
}

module.exports = updateOldApproved;

