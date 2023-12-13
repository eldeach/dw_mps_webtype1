const addMachineMsg = {
    addSuccess : {
        msgCode : "post_addmachine_msg_1",
        kor : "사용자 계정 추가에 성공했습니다.",
        eng : "User account addition was successful.",
    },
    addFail : {
        duplicated : {
            msgCode : "post_addmachine_msg_2",
            kor : "추가하시려는 설비 시스템은 이미 생성되어 있습니다.",
            eng : "The machine system you are trying to add has already been created.",
        },
        alreadyInProgress : {
            msgCode : "post_addmachine_msg_3",
            kor : "이미 진행 중인 건이 있습니다.",
            eng : "There is something already in progress.",
        },
        dbFail : {
            msgCode : "post_addmachine_msg_4",
            kor : "요청 하신 설비 시스템을 데이터베이스에 기록하는데 실패 했습니다. 관리자에게 문의해주세요.",
            eng : "Requested machine system information failed to be recorded in the database. Please contact the administrator.",
        }
    },
    elecSignSuccess : {
        msgCode : "elec_sign_msg_1",
        kor : "즉시시행이 성공하였습니다.",
        eng : "Immediate implementation was successful.",
    },
    elecSignFail : {
        dbFail : {
            msgCode : "post_addmachine_msg_3",
            kor : "요청 하신 정보를 데이터베이스에 기록하는데 실패 했습니다. 관리자에게 문의해주세요.",
            eng : "Requested information failed to be recorded in the database. Please contact the administrator.",
        }
    },
}

module.exports = addMachineMsg;