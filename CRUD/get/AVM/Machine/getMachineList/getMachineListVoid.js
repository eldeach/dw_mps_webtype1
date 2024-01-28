// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getMachineListVoid (app) {
    app.get('/getmachinelistvoid', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_machine_list_void`)
        res.status(200).json(rs)
    })
}

module.exports = getMachineListVoid