// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getProductListRejected (app) {
    app.get('/getproductlistrejected', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_product_list_rejected`)
        res.status(200).json(rs)
    })
}

module.exports = getProductListRejected;