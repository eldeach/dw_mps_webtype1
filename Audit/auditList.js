// ======================================================================================== [Import Component] js
// Function
const { sendReq } = require('../Dbc/dbcMariaAVM');


async function auditList(app) {
    // SELECT
    app.get('/reqauditgethi', async function (req, res) {
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
            procedure: 'audit_sp_get_hi'
        }
        let rs = await sendReq(prm)
        if (!rs.errno) {
            if (rs.output.P_RESULT == "SUCCESS") {
                res.status(200).json(rs)
            } else if (rs.output.P_RESULT == "ERROR") {
                res.status(200).json(rs)
            }
        } else {
            let rserr = {
                output: {
                    P_RESULT: "ERROR",
                    P_VALUE: `${rs.errno}/${rs.sqlState}/${rs.text}`
                },
            }
            res.status(200).json(rserr)
        }
    })
}

module.exports = auditList;