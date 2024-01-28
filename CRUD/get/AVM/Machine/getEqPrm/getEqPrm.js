// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getEqPrm (app) {
    app.get('/geteqprm', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_eq_prm`)
        res.status(200).json(rs)
    })
}

module.exports = getEqPrm;