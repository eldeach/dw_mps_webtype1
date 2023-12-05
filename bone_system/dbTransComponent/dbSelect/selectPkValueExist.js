// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');

// 신규로 데이터를 상신하려고 할 때 원래 있는 PK값인지 점검
async function selectPkValueExist ( tbl_name, pk_column, pk_value ) {
    let rs = await sendQry(
        `SELECT * FROM ${tbl_name} WHERE ${pk_column} = '${pk_value}' AND approval_status = 'APPROVED'`
    )

    if ( rs.length > 0 ) {
        return true;
    } else {
        return false;
    }
}

module.exports = selectPkValueExist;