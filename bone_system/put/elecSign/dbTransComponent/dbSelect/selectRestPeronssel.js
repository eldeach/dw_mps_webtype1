// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');
// 특정 결재라인에서 elecSign에서 결재하려는 사람을 제외하고, 그리고 참조자를 제외하고 남은 사람 수 확인
async function selectRestPeronssel (approval_payload_id, user_account ) {
    let restPersonnel = await sendQry(`
        SELECT
            *
        FROM
            tb_approval_payload
        WHERE
            approval_payload_id = '${approval_payload_id}' AND approval_type !='RECIEVE' AND approval_date_time is NULL AND user_account != '${user_account}'
    `)
    return restPersonnel;
}


module.exports = selectRestPeronssel;
