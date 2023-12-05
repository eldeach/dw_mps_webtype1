function localLogout ( app ) {
    app.get( '/local-logout', function( req, res ) {
        req.session.destroy( async() => {
            res.clearCookie( 'connect.sid' );
            res.redirect( '/sessionexpired' );
        });
    })
}
module.exports = localLogout;