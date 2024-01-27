// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getrequal5year (app) {
    app.get('/getrequal5year', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_re_qual_5_y`)
        res.status(200).json(rs)
    })
}

module.exports = getrequal5year;