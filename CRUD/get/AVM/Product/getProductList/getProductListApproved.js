// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getProductListApproved (app) {
    app.get('/getproductlistapproved', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_product_list_approved`)
        res.status(200).json(rs)
    })
}

module.exports = getProductListApproved;