// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function getPrReview (app) {
    app.get('/getprreview', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_pr_review`)
        res.status(200).json(rs)
    })
}

module.exports = getPrReview;