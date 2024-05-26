// ======================================================================================== [Import Component] js
// Function
const { sendReq } = require('../Dbc/dbcMariaAVM');


async function machineList(app) {
    // SELECT
    app.get('/reqmachinegetnamelist', async function (req, res) {
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
            procedure: 'machine_sp_get_namelist'
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
    // SELECT
    app.get('/reqmachinegetname', async function (req, res) {
        let prm = {
            pInput: [
                {
                    name : 'P_MNG_CODE',
                    value : req.query.MNG_CODE
                }
            ],
            pOutput: [
                {
                    name: 'P_RESULT'
                },
                {
                    name: 'P_VALUE'
                }
            ],
            procedure: 'machine_sp_get_name'
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

module.exports = machineList;