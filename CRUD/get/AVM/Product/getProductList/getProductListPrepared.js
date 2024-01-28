// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getProductListPrepared (app) {
    app.get('/getproductlistprepared', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_product_list_prepared`)
        res.status(200).json(rs)
    })
}

module.exports = getProductListPrepared;