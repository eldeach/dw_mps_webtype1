// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');

async function getUserListVoid (app){
    app.get('/getuserlistvoid', async function(req, res) {
        let rs = await sendQry(`SELECT * FROM view_get_user_list_void`)
        res.status(200).json(rs)
    })
}

module.exports = getUserListVoid;