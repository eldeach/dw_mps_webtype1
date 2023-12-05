

// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');

// bone_system
// dbSelect
const selectPkValueExist = require('../../../bone_system/dbTransComponent/dbSelect/selectPkValueExist')
const selectPkMaxVer = require('../../../bone_system/dbTransComponent/dbSelect/selectPkMaxVer')
const selectSubmitPossibleCheck = require('../../../bone_system/dbTransComponent/dbSelect/selectSubmitPossibleCheck')
// dbInsert
const insertNewApprovalPayload = require('../../../bone_system/dbTransComponent/dbInsert/insertNewApprovalPayload');
const insertNewApprovalId = require('../../../bone_system/dbTransComponent/dbInsert/insertNewApprovalId');
const insertNewIdNumber = require('../../../bone_system/dbTransComponent/dbInsert/insertNewIdNumber');
// bcryot
const changeToHash = require ('../../../bone_system/bcrypt/changeToHash')

//elecSign
//dbselect
const selectPreparedType = require('../../../bone_system/put/elecSign/dbTransComponent/dbSelect/selectPreparedType')
//dbUpdate
const updateApprovalPayloadFinish = require('../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateApprovalPayloadFinish')
const updateApprovalStatus = require('../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateApprovalStatus')
const updateOldApproved = require('../../../bone_system/put/elecSign/dbTransComponent/dbUpdate/updateOldApproved')

// its Object
const addAccountMsg = require('./addAccountMsg');

// its components - dbInsert
const insertDetailedEmail = require('./insertSubRecord/insertDetailedEmail')
const insertDetailedPhone = require('./insertSubRecord/insertDetailedPhone')
const insertDetailedPosition = require('./insertSubRecord/insertDetailedPosition')
const insertDetailedAuth = require('./insertSubRecord/insertDetailedAuth')

async function addAccount ( app ) {
    app.post('/addaccount', async function( req, res ) {
        let duplicatedPk = await selectPkValueExist('tb_user', 'user_account', req.body.user_account) // 중복된 PK 값이 이미 있는지 (NEW 타입인 경우 막을 목적)

        let max_data_ver = await selectPkMaxVer('tb_user', 'user_account', req.body.user_account) // 해당 PK의 최대 데이터 버전 확인
        let sumbitPossible = await selectSubmitPossibleCheck(max_data_ver, 'tb_user', 'user_account', req.body.user_account ) // 해당 PK의 최대 데이터 버전의 레코드 승인상태 확인
        
        let revisionPossible = false
        if ( sumbitPossible.length > 0 ) {
            // 최대 버전을 가진 레코드의 승인상태가 'PREPARED', 'UNDER_APPROVAL' 둘 다 아닌경우 true
            revisionPossible = !(sumbitPossible[0].approval_status == 'PREPARED' || sumbitPossible[0].approval_status == 'UNDER_APPROVAL')
        } else {
            // 해당 PK의 최대 데이터 버전의 레코드가 없다는 뜻이기 때문에 true (사실 해당 PK값을 가진 레코드가 없기 때문)
            revisionPossible = true
        }

        if ( duplicatedPk && req.body.prepared_type === "NEW") { // 새로운 데이터 추가인데 중복된 경우 걸러주기
            res.status(452).json(addAccountMsg.addFail.duplicated)
        } else if ( !revisionPossible ) { // 개정인 경우 진행 중인 건이 이미 있으면 걸러주기 (NEW 타입인 경우 이미 위에서 거른 걸로 OK인 상황)
            res.status(452).json(addAccountMsg.addFail.alreadyInProgress)
        } else {
            // 결재라인 준비
            // 새 결재라인 ID 발행받기 (DB에 저장)
            let approval_payload_id = await insertNewApprovalId('tb_user', 'sys1', '사용자 계정 (User account)', 'System 1', req.body.prepared_type, req.user )
            // 새로 발행받은 결재라인 ID로 결재라인 정보 DB에 저장하기
            let apStoreRs = await insertNewApprovalPayload(approval_payload_id, req.body.approval_payload)

            // 이메일 저장 준비
            // 새 이메일 목록 ID 발행받기 (DB에 저장)
            let user_email_id = await insertNewIdNumber( 'user_email_id', 'tb_user_email_id', 'uei_' )
            // 새로 받은 이메일 목록 ID로 DB에 저장하기
            let rsDetailedEmail = await insertDetailedEmail( user_email_id, req.body.user_email )

            // 전화번호 저장 준비
            // 새 전화번호 목록 ID 발행받기 (DB에 저장)
            let user_phone_id = await insertNewIdNumber( 'user_phone_id', 'tb_user_phone_id', 'upi_' )
            // 새로 받은 전화번호 목록 ID로 DB에 저장하기
            let rsDetailedPhone = await insertDetailedPhone( user_phone_id, req.body.user_phone )

            // 직책 저장 준비
            // 새 직책 목록 ID 발행 받기 (DB에 저장)
            let user_position_id = await insertNewIdNumber( 'user_position_id', 'tb_user_position_id', 'upi_' )
            // 새로 받은 직책 목록 ID로 DB에 저장하기
            let rsDetailedPosition = await insertDetailedPosition( user_position_id, req.body.user_position )

            // 권한 저장 준비
            // 새 권한 목록 ID 발행 받기 (DB에 저장)
            let user_auth_id = await insertNewIdNumber( 'user_auth_id', 'tb_user_auth_id', 'uai_' )
            // 새로 받은 권한 목록 ID로 DB에 저장하기
            console.log("auth_body")
            console.log(req.body.user_auth)
            let rsDetailedAuth = await insertDetailedAuth( user_auth_id, req.body.user_auth )

            // 새 데이터 버전 준비
            let new_data_ver = 0;
            let new_data_sub_ver = 0;
            if ( req.body.prepared_type === "NEW" ) {
                new_data_sub_ver = 1; // 신규면 data_sub_ver만 1로 설정
            } else {
                // 개정이면 data_ver을 이어받고 data_sub_ver을 1증가하여 설정
                new_data_ver = max_data_ver.data_ver
                new_data_sub_ver = max_data_ver.data_sub_ver + 1 
            }

            // 비밀번호 hash 암호화
            let hashedPw = await changeToHash(req.body.user_pw)

            let qryStr = `INSERT INTO tb_user (
                uuid_binary,
                data_ver,
                data_sub_ver,
                approval_status,
                remark,
                revision_history,
                approval_payload_id,
                user_account,
                user_pw,
                user_name,
                user_nickname,
                user_birthday,
                user_gender,
                user_email_id,
                user_phone_id,
                user_position_id,
                user_auth_id,
                login_fail_count,
                user_lock,
                password_reset,
                deactivated,
                previous_approval_payload_id
            )
            VALUES (
                UUID_TO_BIN(UUID()),
                ${new_data_ver},
                ${new_data_sub_ver},
                'PREPARED',
                NULL,
                '${req.body.revision_history}',
                '${approval_payload_id}',
                '${req.body.user_account}',
                '${hashedPw}',
                '${req.body.user_name}',
                '${req.body.user_nickname}',
                '${req.body.user_birthday}',
                '${req.body.user_gender}',
                '${user_email_id}',
                '${user_phone_id}',
                '${user_position_id}',
                '${user_auth_id}',
                0,
                0,
                0,
                0,
                '${req.body.previous_approval_payload_id}'
            )`.replace(/\n/g, "")

            let qryRs = await sendQry(qryStr)

            if ( req.body.immediate_effective ) {
                await updateApprovalPayloadFinish(approval_payload_id) // 결재라인 완료 처리 (done_datetime 컬럼값 업데이트) 
                .then( async ( rs ) => {
                    let preparedType = await selectPreparedType(approval_payload_id)
                    let approvalStr="APPROVED"
                    console.log(preparedType.prepared_type)
                    if ( preparedType.prepared_type == 'VOID') {
                        approvalStr = 'VOID'
                    }
                    await updateApprovalStatus('tb_user', approval_payload_id, approvalStr, 1) // 결재진행한 데이터 승인상태 (approval_status 컬럼값) 업데이트
                    .then( async ( rs ) => {
                        await updateOldApproved('tb_user', approval_payload_id) // 이전 승인 본 VOID 처리 (모든 결재건은 이전 승인본의 approval_payload_id를 가져야함)
                        .then( async ( rs ) => {
                            res.status(200).json(addAccountMsg.elecSignSuccess)
                        })
                        .catch(( error ) => {
                            res.status(512).json(addAccountMsg.elecSignFail.dbFail)
                        })
                    })
                    .catch(( error ) => {
                        console.log(error)
                        res.status(512).json(addAccountMsg.elecSignFail.dbFail)
                    })
                })
                .catch(( error ) => {
                    console.log(error)
                    res.status(512).json(addAccountMsg.elecSignFail.dbFail)
                })
            }
        }
    })
}

module.exports = addAccount;