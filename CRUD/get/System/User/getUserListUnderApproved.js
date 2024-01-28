// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');

async function getUserListUnderApproved (app){
    app.get('/getuserlistunderapproved', async function(req, res) {
        let rs = await sendQry(`SELECT * FROM view_get_user_list_under_approved`)
        res.status(200).json(rs)
    })
}

module.exports = getUserListUnderApproved;