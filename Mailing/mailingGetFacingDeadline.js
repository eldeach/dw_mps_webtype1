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
            rs.recordsets[0].map(async (record, index) => {
                let buildMail = mailContentBuilder(record);
                let tempaa = '2130176@idstrust.com'
                let mailMsg = {
                    to: tempaa, // 수신할 이메일
                    subject: buildMail.mailTitle, // 메일 제목
                    text: buildMail.stmt
                };
                mailMsgs.push(mailMsg)
            })
            nmSendText(mailMsgs)
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
            mailTitle = '[ALARM][1-YEAR Mapping] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 맵핑 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next mapping deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[ALERT][1-YEAR Mapping] '.concat(mainMsg)
        }
        mngSub = "1년 주기 정기적 맵핑 (1-YEAR Periodic Mapping)"

    } else if (value.periodic_mng == '3y_mt') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 맵핑 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next mapping deadline.`
            mailTitle = '[ALARM][3-YEAR Mapping] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 맵핑 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next mapping deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[ALERT][3-YEAR Mapping] '.concat(mainMsg)
        }
        mngSub = "3년 주기 정기적 맵핑 (3-YEAR Periodic Mapping)"

    } else if (value.periodic_mng == '1y_qual') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next qualification deadline.`
            mailTitle = '[ALARM][1-YEAR QUAL] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[ALERT][1-YEAR QUAL] '.concat(mainMsg)
        }
        mngSub = "1년 주기 정기적 적격성 평가 (1-YEAR Periodic Qualification)"

    } else if (value.periodic_mng == '5y_qual') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next qualification deadline.`
            mailTitle = '[ALARM][5-YEAR QUAL] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[ALERT][5-YEAR QUAL] '.concat(mainMsg)
        }
        mngSub = "5년 주기 정기적 적격성 평가 (5-YEAR Periodic Qualification)"

    } else if (value.periodic_mng == '1y_ster') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 멸균 성능 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next sterilization performance qualification deadline.`
            mailTitle = '[ALARM][1-YEAR STER.] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 멸균 성능 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next sterilization performance qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[ALERT][1-YEAR STER.] '.concat(mainMsg)
        }
        mngSub = "1년 주기 정기적 멸균 성능 적격성 평가 (1-YEAR Periodic Sterilization Performance Qualification)"

    } else if (value.periodic_mng == '3y_vhp') {
        if (value.remaining_days >= 0) {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 VHP 성능 적격성 평가 기한까지 ${value.remaining_days}일 남았습니다.`
            mainMsg_eng = `${value.mng_name} (${value.mng_code}) has ${value.remaining_days} days left until the next VHP performance qualification deadline.`
            mailTitle = '[ALARM][3-YEAR VHP] '.concat(mainMsg)
        } else {
            mainMsg = `${value.mng_name} (${value.mng_code})의 차기 VHP 성능 적격성 평가 기한으로 부터 ${value.remaining_days}일 초과되었습니다.`
            mainMsg_eng = `The next VHP performance qualification deadline for ${value.mng_name} (${value.mng_code}) has exceeded by ${value.remaining_days} days.`
            mailTitle = '[ALERT][3-YEAR VHP] '.concat(mainMsg)
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

module.exports = { mailingGetFacingDeadline }