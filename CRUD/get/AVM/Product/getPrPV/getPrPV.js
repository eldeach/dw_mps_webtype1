// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getPrPV (app) {
    app.get('/getprpv', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_pr_pv`)
        res.status(200).json(rs)
    })
}

module.exports = getPrPV;