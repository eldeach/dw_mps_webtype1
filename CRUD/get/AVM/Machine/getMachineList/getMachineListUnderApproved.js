// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getMachineListUnderApproved (app) {
    app.get('/getmachinelistunderapproved', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_machine_list_under_approved`)
        res.status(200).json(rs)
    })
}

module.exports = getMachineListUnderApproved;