// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../dbconns/maria/thisdb');
// 특정 시스템에서 각 결재 타입의 특정 유저에게 할당된 결재목록들 보여줌
async function getAuthList (app){
    app.get('/getauthlist', async function(req, res) {
        let rs = await sendQry( // tb_approval_payload와 tb_approval_payload_id 만 가지고 작동해야함 (범용으로 써야함)
           `SELECT * FROM tb_auth_code`
        )
        res.status(200).json(rs)
    })
}

module.exports = getAuthList;