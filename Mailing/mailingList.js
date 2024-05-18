// ======================================================================================== [Import Component] js
// Function
const { sendReq } = require('../Dbc/dbcMariaLocal');


async function mailingList(app) {
    // SELECT
    app.get('/reqmailinggetlist', async function (req, res) {
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
    // INSERT
    app.post('/reqmailingaddlist', async function (req, res) {
        let prm = {
            pInput: [
                {
                    name: 'P_CALL_USER_ID',
                    value: `${req.user}`
                },
                {
                    name: 'P_MNG_CODE',
                    value: `${req.body.MNG_CODE}`
                },
                {
                    name: 'P_EMAIL_ADDRESS',
                    value: `${req.body.EMAIL_ADDRESS}`
                },
                {
                    name: 'P_EMAIL_ROLE',
                    value: `${req.body.EMAIL_ROLE}`
                },
                {
                    name: 'P_USE_YN',
                    value: 'Y'
                },
            ],
            pOutput: [
                {
                    name: 'P_RESULT'
                },
                {
                    name: 'P_VALUE'
                }
            ],
            procedure: 'mailing_sp_add_list'
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

    // UPDATE
    app.put('/reqmailingupdlist', async function (req, res) {

        let disableUUIDs = ''
        req.body.disableRows.map((value, index) => {
            disableUUIDs = disableUUIDs.concat(`\\'${value}\\'`)
            if (index != (req.body.disableRows.length - 1)) {
                disableUUIDs = disableUUIDs.concat(',')
            }
        })
        console.log(disableUUIDs)
        let prm = {
            pInput: [
                {
                    name: 'P_CALL_USER_ID',
                    value: `${req.user}`
                },
                {
                    name: 'P_UUID_LIST',
                    value: `${req.body.UUID_LIST}`
                },
                {
                    name: 'P_EMAIL_ADDRESS',
                    value: `${req.body.EMAIL_ADDRESS}`
                },
                {
                    name: 'P_EMAIL_ROLE',
                    value: `${req.body.EMAIL_ROLE}`
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
            procedure: 'mailing_sp_upd_list'
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

    // UPDATE
    app.put('/reqmailingguseynlist', async function (req, res) {
        console.log(req)
        let disableUUIDs = ''
        req.body.disableRows.map((value, index) => {
            disableUUIDs = disableUUIDs.concat(`\\'${value}\\'`)
            if (index != (req.body.disableRows.length - 1)) {
                disableUUIDs = disableUUIDs.concat(',')
            }
        })
        console.log(disableUUIDs)
        let prm = {
            pInput: [
                {
                    name: 'P_CALL_USER_ID',
                    value: `${req.user}`
                },
                {
                    name: 'P_UUID_LIST',
                    value: disableUUIDs
                },
                {
                    name: 'P_USE_YN',
                    value: 'N'
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
            procedure: 'mailing_sp_useyn_list'
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

    // DELETE
    app.delete('/reqmailinggdelist', async function (req, res) {

        let delUUIDs = ''
        req.query.delRows.map((value, index) => {
            delUUIDs = delUUIDs.concat(`\\'${value}\\'`)
            if (index != (req.query.delRows.length - 1)) {
                delUUIDs = delUUIDs.concat(',')
            }
        })
        console.log(delUUIDs)
        let prm = {
            pInput: [
                {
                    name: 'P_UUID_LIST',
                    value: delUUIDs
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
            procedure: 'mailing_sp_del_list'
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

module.exports = mailingList;