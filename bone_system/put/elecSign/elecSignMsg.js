const elecSignMsg = {
    elecSignSuccess : {
        msgCode : "elec_sign_msg_1",
        kor : "전자서명이 성공하였습니다.",
        eng : "Electric Signature was successful.",
    },
    elecSignFail : {
        notYours : {
            msgCode : "elec_sign_msg_2",
            kor : "사용자 소유의 계정이 아닙니다.",
            eng : "This is not your account.",
        },
        wrongPW : {
            msgCode : "elec_sign_msg_3",
            kor : "잘못된 비밀번호입니다.",
            eng : "Incorrect password.",
        },
        dbFail : {
            msgCode : "_elec_sign_msg_4",
            kor : "요청 하신 정보를 데이터베이스에 기록하는데 실패 했습니다. 관리자에게 문의해주세요.",
            eng : "Requested information failed to be recorded in the database. Please contact the administrator.",
        }
    },
}

module.exports = elecSignMsg;