// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getrequalVHP (app) {
    app.get('/getrequalvhp', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_re_qual_vhp`)
        res.status(200).json(rs)
    })
}

module.exports = getrequalVHP;