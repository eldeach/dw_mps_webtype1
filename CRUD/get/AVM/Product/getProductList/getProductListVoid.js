// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');



function getProductListVoid (app) {
    app.get('/getproductlistvoid', async function ( req, res ) {
        let rs = await sendQry(`SELECT * FROM view_get_product_list_void`)
        res.status(200).json(rs)
    })
}

module.exports = getProductListVoid;