// ======================================================================================== [Import Component] js
// Function
const { sendReq } = require('../Dbc/dbcMariaLocal');


async function mailerGetList(app) {
    app.get('/mailinggetlist', async function (req, res) {
        let prm = {
            pInput: [],
            pOutput: [
                {
                    name: 'P_RESULT'
                },
                {
                    name: 'P_VALUE'
                }
            ],
            procedure: 'mailing_sp_get_list'
        }
        let rs = await sendReq(prm)
        if (!rs.errno && rs.output.P_RESULT == "SUCCESS") {
            res.status(200).json(rs.recordsets[0])
        } else if (rs.output.P_RESULT == "FAIL") {
            res.status(200).json([])
        } else if (rs.output.P_RESULT == "ERROR") {
            res.status(200).json([])
        } else {
            res.status(200).json([])
        }
        
    })
}

module.exports = mailerGetList;