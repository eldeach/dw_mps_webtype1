// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');

async function getUserListRejected (app){
    app.get('/getuserlistrejected', async function(req, res) {
        let rs = await sendQry(`SELECT * FROM view_get_user_list_rejected`)
        res.status(200).json(rs)
    })
}

module.exports = getUserListRejected;