// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');

async function getUserListApproved (app){
    app.get('/getuserlistapproved', async function(req, res) {
        let rs = await sendQry(`SELECT * FROM view_get_user_list_approved`)
        res.status(200).json(rs)
    })
}

module.exports = getUserListApproved;