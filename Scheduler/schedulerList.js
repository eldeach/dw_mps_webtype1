// ======================================================================================== [Import Libaray]
// dayjs
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
// ======================================================================================== [Import Component] js
// Function
const { sendReq } = require('../Dbc/dbcMariaAVM');
const { scdReRunAll } = require('./scheduler')


async function schedulerList(app) {
    // SELECT
    app.get('/reqschedulergetList', async function (req, res) {
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
            procedure: 'scheduler_sp_get_list'
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
    app.put('/reqschedulerupdlist', async function (req, res) {
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
                    name: 'P_RUN_PERIOD',
                    value: `${valuePayload.RUN_PERIOD}`
                },
                {
                    name: 'P_PERIOD_UNIT',
                    value: `${valuePayload.PERIOD_UNIT}`
                },
                {
                    name: 'P_END_DATE',
                    value: `${dayjs(valuePayload.END_DATE).tz("Asia/Seoul").format("YYYY-MM-DD")}`
                },
                {
                    name: 'P_USE_YN',
                    value: `${valuePayload.USE_YN}`
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
            procedure: 'scheduler_sp_upd_list'
        }
        let rs = await sendReq(prm)
        if (!rs.errno) {
            if (rs.output.P_RESULT == "SUCCESS") {
                scdReRunAll()
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
    app.put('/reqscheduleruseynlist', async function (req, res) {
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
            procedure: 'scheduler_sp_useyn_list'
        }
        let rs = await sendReq(prm)
        if (!rs.errno) {
            if (rs.output.P_RESULT == "SUCCESS") {
                scdReRunAll()
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

module.exports = schedulerList;