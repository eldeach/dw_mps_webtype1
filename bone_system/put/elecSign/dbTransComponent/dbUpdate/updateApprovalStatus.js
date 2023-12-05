// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');
async function updateApprovalStatus(tbl_name, approval_payload_id, approval_status, dataVerPlus){
    console.log(tbl_name)
    // 특정 테이블에 귀속되면 안됨
    // tb_approval_payload_id, tb_approval_payload 두개 테이블과 tbl_name 값만 사용해서 데이터 테이블 레코드에 접근해야함
    let subVer = ''
    if ( dataVerPlus === 1) {
        subVer = '0'
    } else {
        subVer = 'data_sub_ver'
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