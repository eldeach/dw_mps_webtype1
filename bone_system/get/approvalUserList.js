// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../dbconns/maria/thisdb');
// 결재올릴때 소속만 붙어서 나오는 유저 리스트
async function approvalUserList (app){
    app.get('/getapprovaluserlist', async function(req, res) {
        let rs = await sendQry(
            `SELECT A.user_account AS user_account, A.user_name AS user_name, B.job_team AS job_team, B.job_position AS job_position, B.job_company AS job_company `
            .concat(`FROM tb_user AS A LEFT OUTER JOIN tb_user_position AS B `)
            .concat(`ON A.user_position_id = B.user_position_id `)
            .concat(`WHERE A.approval_status = 'APPROVED'`)
        )

        res.status(200).json(rs)
    })
}

module.exports = approvalUserList;