const expireTimeMinutes = process.env.passport_session_expire_time_minutes

const passportLocalMsg = {
    loginSuccess : {
        msgCode : "passport_local_msg_1",
        kor : "로그인이 성공하였습니다.",
        eng : "Login was successful.",
        expireTimeMinutes : expireTimeMinutes
    },
    loginFail : {
        userLock : {
            msgCode : "passport_local_msg_2",
            kor : "이 계정은 잠겨있습니다.",
            eng : "This account is locked.",
        },
        wrongPW : {
            msgCode : "passport_local_msg_3",
            kor : "잘못된 비밀번호입니다.",
            eng : "Incorrect password.",
        },
        noAccount : {
            msgCode : "passport_local_msg_4",
            kor : "이 계정은 없는 계정입니다.",
            eng : "This account does not exist.",
        },
    },
    sessionOk : {
        msgCode : "passport_local_msg_5",
        kor : "현재 로그인 상태입니다.",
        eng : "You are currently logged in.",
        expireTimeMinutes : expireTimeMinutes
    },
    sessionNotOk : {
        msgCode : "passport_local_msg_6",
        kor : "현재 로그인 상태가 아닙니다.",
        eng : "You are not currently logged in.",
    },
}

module.exports = passportLocalMsg;