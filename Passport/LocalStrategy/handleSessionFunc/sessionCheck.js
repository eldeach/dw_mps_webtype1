// ======================================================================================== [Import Component] js
// Object
const passportLocalMsg = require ( '../passportLocalMsg' );

function sessionCheck ( app ) {
    app.get( '/sessioncheck', function ( req, res ) {
        if ( req.user ) {
            res.status( 200 ).json( passportLocalMsg.sessionOk )
        } else {
            res.status( 452 ).json( passportLocalMsg.sessionNotOk )
        }
    })
}
module.exports = sessionCheck;


