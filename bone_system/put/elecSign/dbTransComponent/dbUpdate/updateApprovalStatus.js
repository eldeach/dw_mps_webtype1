// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


/**
 * 특정 레코드의 승인 상태를 변경하는 함수
 * @version 1.0.0
 * @params {string} tbl_name 레코드가 기록되는 테이블 명
 * @params {string} approval_payload_id 레코드가 가진 approval_payload_id, 핸들링해야 할 레코드를 특정하는데 사용
 * @params {string} approval_status 적용하고자 하는 상태, 택 1 : PREPARED / WITHDRAWN / REJECTED / VOID / UNDER_VOID / UNDER_APPROVAL / APPROVED
 * @params {number} dataVerPlus == 0인 경우 data_ver과 data_sub_ver 변경 안 함 / dataVerPlus != 0인 경우 :  data_ver += 1, data_sub_ver=0으로 update (승인상태로 변경)
 * @returns {string} DB update 결과 return
 */

async function updateApprovalStatus(tbl_name, approval_payload_id, approval_status, dataVerPlus){
    // console.log(tbl_name)
    // 특정 테이블에 귀속되면 안됨
    // tb_approval_payload_id, tb_approval_payload 두개 테이블과 tbl_name 값만 사용해서 데이터 테이블 레코드에 접근해야함
    let subVer = ''
    if ( dataVerPlus === 0) {
        subVer = 'data_sub_ver'
    } else {
        subVer = '0'
    }

   let rs =  await sendQry(`
        UPDATE
            ${tbl_name}
        SET
            approval_status = '${approval_status}',
            data_ver = (data_ver + ${dataVerPlus}),
            data_sub_ver = ${subVer}
        WHERE
            approval_payload_id = '${approval_payload_id}'
    `)
    .then( async ( rs ) => {
        return rs
    })
    .catch(( error ) => {
        console.log(error)
        return error
    })
}

module.exports = updateApprovalStatus;