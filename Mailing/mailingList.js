// ======================================================================================== [Import Component] js
// Function
const { sendReq } = require('../Dbc/dbcMariaAVM');


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
        let valuePayload = JSON.parse(req.query.valuePayload)
        let prm = {
            pInput: [
                {
                    name: 'P_CALL_USER_ID',
                    value: `${req.user}`
                },
                {
                    name: 'P_MNG_CODE',
                    value: `${valuePayload.MNG_CODE}`
                },
                {
                    name: 'P_EMAIL_ADDRESS',
                    value: `${valuePayload.EMAIL_ADDRESS}`
                },
                {
                    name: 'P_RECEIVE_TYPE',
                    value: `${valuePayload.RECEIVE_TYPE}`
                },
                {
                    name: 'P_EMAIL_ROLE',
                    value: `${valuePayload.EMAIL_ROLE}`
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
                let errCode = rs.output.P_VALUE.split('/')[0]
                if (errCode == '1062') { // PK 중복인 경우
                    res.status(200).json({
                        output: {
                            P_RESULT: 'ERROR',
                            P_VALUE: `${valuePayload.MNG_CODE}, ${valuePayload.EMAIL_ADDRESS}은 중복된 수신처입니다.`
                        },
                        recordsets: []
                    })

                } else {
                    res.status(200).json(rs)
                }
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
        let valuePayload = JSON.parse(req.query.valuePayload)
        let prm = {
            pInput: [
                {
                    name: 'P_CALL_USER_ID',
                    value: `${req.user}`
                },
                {
                    name: 'P_UUID_STR',
                    value: `${valuePayload.UUID_STR}`
                },
                {
                    name: 'P_EMAIL_ADDRESS',
                    value: `${valuePayload.EMAIL_ADDRESS}`
                },
                {
                    name: 'P_RECEIVE_TYPE',
                    value: `${valuePayload.RECEIVE_TYPE}`
                },
                {
                    name: 'P_EMAIL_ROLE',
                    value: `${valuePayload.EMAIL_ROLE}`
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
                let errCode = rs.output.P_VALUE.split('/')[0]
                if (errCode == '1062') { // PK 중복인 경우
                    res.status(200).json({
                        output: {
                            P_RESULT: 'ERROR',
                            P_VALUE: `${valuePayload.MNG_CODE}, ${valuePayload.EMAIL_ADDRESS}은 중복된 수신처입니다.`
                        },
                        recordsets: []
                    })

                } else {
                    res.status(200).json(rs)
                }
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
    app.put('/reqmailinguseynlist', async function (req, res) {
        let disableUUIDs = ''
        req.query.disableRows.map((value, index) => {
            disableUUIDs = disableUUIDs.concat(`\\'${value}\\'`)
            if (index != (req.query.disableRows.length - 1)) {
                disableUUIDs = disableUUIDs.concat(',')
            }
        })
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
                    value: req.query.useyn
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