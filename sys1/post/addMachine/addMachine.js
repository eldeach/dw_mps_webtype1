async function addMachine ( app ) {
    app.post('/addmachine', async function( req, res ) {
        console.log(req.body)
    })

}

module.exports = addMachine;