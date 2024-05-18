// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getMachineListApproved (app) {
    app.get('/getmachinelistapproved', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_machine_list_approved`)
        res.status(200).json(rs)
    })
}

module.exports = getMachineListApproved;