// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');
//view_get_re_map_1_y

async function getReMap1year (app) {
    app.get('/getremap1year', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_re_map_1_y`)
        res.status(200).json(rs)
    })
}

module.exports = getReMap1year;