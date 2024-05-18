// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getMachineListRejected (app) {
    app.get('/getmachinelistrejected', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_machine_list_rejected`)
        res.status(200).json(rs)
    })
}

module.exports = getMachineListRejected;