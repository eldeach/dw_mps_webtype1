// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getrequalSter (app) {
    app.get('/getrequalster', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_re_qual_ster`)
        res.status(200).json(rs)
    })
}

module.exports = getrequalSter;