// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getReMap3year (app) {
    app.get('/getremap3year', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_re_map_3_y`)
        res.status(200).json(rs)
    })
}

module.exports = getReMap3year;