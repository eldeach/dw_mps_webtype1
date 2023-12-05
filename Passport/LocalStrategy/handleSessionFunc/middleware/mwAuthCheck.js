// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');

async function mwAuthCheck (req, res, next) {

    if ( req.user ) {
        let rs = await sendQry(
            "SELECT C.user_account, D.url_path "
            .concat( "FROM (SELECT A.user_account AS user_account, B.user_auth_id AS user_auth_id, B.auth_code AS auth_code " )
            .concat( "FROM tb_user AS A LEFT OUTER JOIN tb_user_auth AS B ON A.user_auth_id = B.user_auth_id WHERE A.user_account = '" ).concat( req.user ).concat( "' AND A.approval_status = 'APPROVED') AS C " )
            .concat( "LEFT OUTER JOIN tb_auth_code AS D " )
            .concat( "ON C.auth_code = D.auth_code " )
            .concat( "WHERE D.url_path = '" ).concat( req.originalUrl ).concat( "';" )
        )
        if ( rs.length > 0 ) {
            next()
          } else {
            res.redirect( '/noauth' )
          }
    } else {
        res.clearCookie( 'connect.sid' );
        res.redirect( '/sessionexpired' )
    }
}
module.exports = mwAuthCheck;