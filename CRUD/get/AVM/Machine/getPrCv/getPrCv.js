// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');

//
async function getprCv (app) {
    app.get('/getprcv', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_pr_cv`)
        res.status(200).json(rs)
    })
}

module.exports = getprCv;