const sendReq = require('../Dbc/dbcMariaAVM').sendReq
const { nmSendText } = require('../NodeMailer/nmSendText')

async function mailingGetFacingDeadline() {
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
        procedure: 'mailing_sp_get_facing_deadline'
    }
    let rs = await sendReq(prm)
    if (!rs.errno) {
        if (rs.output.P_RESULT == "SUCCESS") {
            let mailMsgs = []
            let alarmList = rs.recordsets[0]
            for (const machine of alarmList) {
                let buildMail = mailContentBuilder(machine);
                let addrList = await getMailAddress(machine.mng_code)
                if (addrList.length > 0) {
                    let toList = []
                    let ccList = []
                    addrList.map((value, index) => {
                        if (value.EMAIL_ROLE == "TL" && machine.remaining_days > 1) {
                            // 남은 기한일이 1일 이하가 아니면 팀장에게는 안 보냄
                        } else {
                            if (value.RECEIVE_TYPE == "TO") {
                                toList.push(value.EMAIL_ADDRESS)
                            } else {
                                ccList.push(value.EMAIL_ADDRESS)
                            }
                        }
                    })

                    let mailMsg = {
                        to: toList, // 수신할 이메일
                        cc: ccList,
                        subject: buildMail.mailTitle, // 메일 제목
                        text: buildMail.stmt
                    };
                    mailMsgs.push(mailMsg)
                } else {
                    let prm = {
                        pInput: [
                            {
                                name: 'P_TIER',
                                value: 'WAS'
                            },
                            {
                                name: 'P_CPNT',
                                value: 'mailingGetFacingDeadline'
                            },
                            {
                                name: 'P_AUDIT_TYPE',
                                value: 'ALRAM'
                            },
                            {
                                name: 'P_AUDIT_MSG',
                                value: `(${machine.mng_code}) ${machine.mng_name}에 대한 이메일 수신처가 설정되어 있지 않아 다음 제목의 이메일을 발송하지 못하였습니다. : "${buildMail.mailTitle}"`
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
                        procedure: 'audit_sp_add_hi'
                    }
                    let rs = await sendReq(prm)
                    if (!rs.errno) {
                        if (rs.output.P_RESULT == "SUCCESS") {

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
            }

            if (mailMsgs.length > 0) nmSendText(mailMsgs)
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

function mailContentBuilder(value) {
    let mailTitle = ''
    let mainMsg = ''
    let mainMsg_eng = ''
    let mngSub = ''
    if (value.periodic_mng == '1y_mt') {

        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 맵핑 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next mapping deadline.`
            mailTitle = '[AVM System][ALARM][1-YEAR Mapping] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 맵핑 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next mapping deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[AVM System][ALERT][1-YEAR Mapping] '.concat(mainMsg)
        }
        mngSub = "1년 주기 정기적 맵핑 (1-YEAR Periodic Mapping)"

    } else if (value.periodic_mng == '3y_mt') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 맵핑 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next mapping deadline.`
            mailTitle = '[AVM System][ALARM][3-YEAR Mapping] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 맵핑 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next mapping deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[AVM System][ALERT][3-YEAR Mapping] '.concat(mainMsg)
        }
        mngSub = "3년 주기 정기적 맵핑 (3-YEAR Periodic Mapping)"

    } else if (value.periodic_mng == '1y_qual') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next qualification deadline.`
            mailTitle = '[AVM System][ALARM][1-YEAR QUAL] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[AVM System][ALERT][1-YEAR QUAL] '.concat(mainMsg)
        }
        mngSub = "1년 주기 정기적 적격성 평가 (1-YEAR Periodic Qualification)"

    } else if (value.periodic_mng == '5y_qual') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next qualification deadline.`
            mailTitle = '[AVM System][ALARM][5-YEAR QUAL] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[AVM System][ALERT][5-YEAR QUAL] '.concat(mainMsg)
        }
        mngSub = "5년 주기 정기적 적격성 평가 (5-YEAR Periodic Qualification)"

    } else if (value.periodic_mng == '1y_ster') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 멸균 성능 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next sterilization performance qualification deadline.`
            mailTitle = '[AVM System][ALARM][1-YEAR STER.] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 멸균 성능 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next sterilization performance qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[AVM System][ALERT][1-YEAR STER.] '.concat(mainMsg)
        }
        mngSub = "1년 주기 정기적 멸균 성능 적격성 평가 (1-YEAR Periodic Sterilization Performance Qualification)"

    } else if (value.periodic_mng == '3y_vhp') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 VHP 성능 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next VHP performance qualification deadline.`
            mailTitle = '[AVM System][ALARM][3-YEAR VHP] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 VHP 성능 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next VHP performance qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[AVM System][ALERT][3-YEAR VHP] '.concat(mainMsg)
        }
        mngSub = "3년 주기 정기적 VHP 성능 적격성 평가 (3-YEAR Periodic VHP Performance Qualification)"
    }

    let stmt = `관리주제 (Management Subject) : ${mngSub}\n`
        .concat(`주기(Period) : ${value.period_month} 개월(Month)\n\n`)
        .concat(`${mainMsg}\n`)
        .concat(`관리팀 : ${value.mng_team}\n`)
        .concat(`다음 기한일 : ${value.next_deadline}\n`)
        .concat(`\n`)
        .concat(`${mainMsg_eng}\n`)
        .concat(`Management Team : ${value.mng_team}\n`)
        .concat(`Next Deadline : ${value.next_deadline}`)


    return { mailTitle: mailTitle, stmt: stmt }
}


async function getMailAddress(mngCode) {
    let prm = {
        pInput: [
            {
                name: 'P_MNG_CODE',
                value: mngCode
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
        procedure: 'mailing_sp_get_address_by_mng_code'
    }
    let rs = await sendReq(prm)
    if (!rs.errno) {
        if (rs.output.P_RESULT == "SUCCESS") {
            return rs.recordsets[0]
        } else {
            let rserr = {
                output: {
                    P_RESULT: "ERROR",
                    P_VALUE: `${rs.errno}/${rs.sqlState}/${rs.text}`
                },
            }
            console.log(rserr)
            return []
        }
    }
}

module.exports = { mailingGetFacingDeadline }