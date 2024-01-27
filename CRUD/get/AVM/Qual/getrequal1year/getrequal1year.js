// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getrequal1year (app) {
    app.get('/getrequal1year', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_re_qual_1_y`)
        res.status(200).json(rs)
    })
}

module.exports = getrequal1year;