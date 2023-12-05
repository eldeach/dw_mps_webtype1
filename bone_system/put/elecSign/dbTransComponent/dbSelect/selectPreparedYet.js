// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');

async function selectPreparedYet (tbl_name, approval_payload_id) {
    console.log(approval_payload_id)
    let rs = await sendQry(`
        SELECT * FROM ${tbl_name} WHERE approval_payload_id = '${approval_payload_id}' AND approval_status = 'PREPARED'
    `)
    return rs
}

module.exports = selectPreparedYet;