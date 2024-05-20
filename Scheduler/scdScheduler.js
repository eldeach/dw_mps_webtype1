const schedule = require('node-schedule');
const { sendQry, sendReq } = require('../Dbc/dbcMariaAVM')
const moment = require('moment');
const { scdTaskList } = require('./scdTaskList')

function scdReRunAll() {
    scdStopAll();
    scdRunAll()
}

function scdStopAll() {
    // 새로운 task가 추가되거나 USE_YN이 수정되면 전체 종료 하고 재시작해야함.
    schedule.gracefulShutdown();
}

async function scdRunAll() {

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
        procedure: 'scheduler_sp_get_tasklist_y'
    }
    let rs = await sendReq(prm)
    if (!rs.errno) {
        if (rs.output.P_RESULT == "SUCCESS") {
            rs.recordsets[0].map((task, key) => {
                nextScheduler(task)
            })
        } else if (rs.output.P_RESULT == "ERROR") {
            console.log(rs.output)
        }
    } else {
        let rserr = {
            output: {
                P_RESULT: "ERROR",
                P_VALUE: `${rs.errno}/${rs.sqlState}/${rs.text}`
            },
        }
        console.log(rserr)
    }
}

async function nextScheduler(task) {
    let nextDate = await nextDateFinder(task)
    // console.log(nextDate)
    if (nextDate != 0) {
        schedule.scheduleJob(nextDate, async () => {
            scdTaskList[task.TASK_NAME]()
            await scdRunDateUpdate(task, nextDate)
            if (!task.END_DATE || (moment(task.END_DATE).diff(moment(new Date()), 'seconds') >= 0)) {
                nextScheduler(task)
            }
        })
    }
}

async function nextDateFinder(task) { // 다음 실행 시점이 즉시일 수도, 인터벌이 계산된 다음 시점이 반환될 수 도 있음
    let prm = {
        pInput: [
            {
                name: 'P_TASK_NAME',
                value: task.TASK_NAME
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
        procedure: 'scheduler_sp_get_nextdate'
    }
    let rs = await sendReq(prm)
    if (!rs.errno) {
        if (rs.output.P_RESULT == "SUCCESS") {
            return rs.output.P_VALUE
        } else if (rs.output.P_RESULT == "ERROR") {
            console.log(rs.output)
            return 0;
        }
    } else {
        let rserr = {
            output: {
                P_RESULT: "ERROR",
                P_VALUE: `${rs.errno}/${rs.sqlState}/${rs.text}`
            },
        }
        console.log(rserr)
        return 0;
    }
}

async function scdRunDateUpdate(task, runDate) {

    let prm = {
        pInput: [
            {
                name: 'P_TASK_NAME',
                value: task.TASK_NAME
            },
            {
                name: 'P_LAST_RUN',
                value: `${moment(runDate).format("YYYY-MM-DD HH:mm:ss")}`
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
        procedure: 'scheduler_sp_upd_last_run'
    }
    let rs = await sendReq(prm)
    if (!rs.errno) {
        if (rs.output.P_RESULT == "SUCCESS") {
            // console.log(rs.output)
        } else if (rs.output.P_RESULT == "ERROR") {
            console.log(rs.output)
        }
    } else {
        let rserr = {
            output: {
                P_RESULT: "ERROR",
                P_VALUE: `${rs.errno}/${rs.sqlState}/${rs.text}`
            },
        }
        console.log(rserr)
    }
}

module.exports = { scdRunAll, scdStopAll, scdReRunAll }