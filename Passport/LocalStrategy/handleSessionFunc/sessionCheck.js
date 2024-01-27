
//moment
const moment = require("moment");

// ======================================================================================== [Import Component] js
// Object
const passportLocalMsg = require ( '../passportLocalMsg' );

function sessionCheck ( app ) {
    app.get( '/sessioncheck', function ( req, res ) {
        if ( req.user ) {
            let tempMsg = passportLocalMsg.sessionOk
            tempMsg.expireDateTime = moment(new Date).add(tempMsg.expireTimeMinutes, 'm')
            res.status( 200 ).json( tempMsg )
        } else {
            res.status( 452 ).json( passportLocalMsg.sessionNotOk )
        }
    })
}
module.exports = sessionCheck;


