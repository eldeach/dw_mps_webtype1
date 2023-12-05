// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../dbconns/maria/thisdb');
// 특정 시스템에서 각 결재 타입의 특정 유저에게 할당된 결재목록들 보여줌
async function myReviewList (app){
    app.get('/getmyreviewlist', async function(req, res) {
        let rs = await sendQry( // tb_approval_payload와 tb_approval_payload_id 만 가지고 작동해야함 (범용으로 써야함)
            `
            SELECT
                *
            FROM
                (
                SELECT 
                  	D.approval_payload_id,
                    D.tbl_name,
                    D.sys_code,
                  	D.service_type,
                    D.sys_name,
                  	D.approval_order,
                  	D.min_approval_order,
                  	D.sign_possible,
                  	D.approval_type,
                  	D.user_account,
                  	D.user_name,
                  	D.chosen_approval,
                  	D.approval_date_time,
                  	D.delegated,
                  	D.user_comment
                FROM
                    (
                    SELECT
                        A.approval_payload_id,
                        B.tbl_name,
                        B.sys_code,
                        B.service_type,
                        B.sys_name,
                        A.approval_order,
                        C.min_approval_order,
                        if(A.approval_order = C.min_approval_order, 1, 0) AS sign_possible,
                        A.approval_type,
                        A.user_account,
                        A.user_name,
                        A.chosen_approval,
                        A.approval_date_time,
                        A.delegated,
                        A.user_comment
                    FROM
                        tb_approval_payload AS A
                        LEFT OUTER JOIN tb_approval_payload_id AS B
                        ON A.approval_payload_id = B.approval_payload_id
                        LEFT OUTER JOIN (
                            SELECT
                                approval_payload_id,
                                MIN(approval_order) AS min_approval_order,
                                user_account
                            FROM tb_approval_payload
                            WHERE approval_date_time IS NULL
                            GROUP BY approval_payload_id
                        ) AS C
                        ON A.approval_payload_id = C.approval_payload_id
                    ) AS D
                WHERE D.approval_date_time IS NULL AND D.sign_possible
                ) AS E
                WHERE E.user_account = '${req.user}' AND E.approval_type = '${req.query.approval_type}' AND sys_code = '${req.query.sys_code}'  
            `.replace(/\n/g, "")
        )
        res.status(200).json(rs)
    })
}

module.exports = myReviewList;