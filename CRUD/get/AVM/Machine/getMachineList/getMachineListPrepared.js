// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getMachineListPrepared (app) {
    app.get('/getmachinelistprepared', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_machine_list_prepared`)
        res.status(200).json(rs)
    })
}

module.exports = getMachineListPrepared;