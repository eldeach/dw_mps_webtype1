// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getReMap3YearSeason (app) {
    app.get('/getremap3yearseason', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_re_map_3_y_s` )
        res.status(200).json(rs)
    })
}

module.exports = getReMap3YearSeason;