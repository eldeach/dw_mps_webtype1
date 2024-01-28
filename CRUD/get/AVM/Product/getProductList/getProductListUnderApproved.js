// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getProductListUnderApproved (app) {
    app.get('/getproductlistunderapproved', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_product_list_under_approved`)
        res.status(200).json(rs)
    })
}

module.exports = getProductListUnderApproved;