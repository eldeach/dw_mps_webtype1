// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../dbconns/maria/thisdb');
// 특정 시스템에서 각 결재 타입의 특정 유저에게 할당된 결재목록들 보여줌
async function myPrepared (app){
    app.get('/getmypreparedlist', async function(req, res) {
        let rs = await sendQry( // tb_approval_payload와 tb_approval_payload_id 만 가지고 작동해야함 (범용으로 써야함)
            `
            SELECT
                A.approval_payload_id AS approval_payload_id,
                A.tbl_name AS tbl_name,
                A.sys_code AS sys_code,
                A.service_type AS service_type,
                A.sys_name AS sys_name,
                A.prepared_type AS prepared_type,
                A.prepared_by AS prepared_by,
                A.prepared_datetime AS prepared_datetime,
                A.done_datetime AS done_datetime,
                B.approval_status AS approval_status
            FROM
                tb_approval_payload_id AS A
                LEFT OUTER JOIN tb_user AS B
                ON A.approval_payload_id = B.approval_payload_id	
            WHERE prepared_by = '${req.user}' AND sys_code = '${req.query.sys_code}'
            `.replace(/\n/g, "")
        )
        res.status(200).json(rs)
    })
}

module.exports = myPrepared;