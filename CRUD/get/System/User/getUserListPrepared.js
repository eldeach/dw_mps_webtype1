// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');

async function getUserListPrepared (app){
    app.get('/getuserlistprepared', async function(req, res) {
        let rs = await sendQry(`SELECT * FROM view_get_user_list_prepared`)
        res.status(200).json(rs)
    })
}

module.exports = getUserListPrepared;