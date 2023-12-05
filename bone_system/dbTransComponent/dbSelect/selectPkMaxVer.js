// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');
// 특정 PK값에 대해 최대 버전 , 최대 서브 버전을 찾아줌
async function selectPkMaxVer ( tbl_name, pk_column, pk_value ) {

    let rs = await sendQry(
        `
        SELECT
            MAX(data_ver) AS data_ver,
            MAX(data_sub_ver) AS data_sub_ver,
            ${pk_column}
        FROM ${tbl_name} AS A
        WHERE A.${pk_column} = '${pk_value}' AND A.data_ver = (SELECT MAX(A.data_ver) FROM ${tbl_name} AS A WHERE A.${pk_column} = '${pk_value}')
        `
    )

    return rs[0]

}

module.exports = selectPkMaxVer;