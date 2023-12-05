// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');

async function selectSubmitPossibleCheck (max_data_ver, tbl_name, pk_column, pk_value ) {
// 특정 테이블에서 PK커럼에 대해 최대 버전, 최대 서브 버전을 고려해 진행중인 사항이 있는지 확인
    let rs = await sendQry(
        `
        SELECT
            data_ver,
            data_sub_ver,
            ${pk_column},
            approval_status
        FROM ${tbl_name} AS A
        WHERE A.${pk_column} = '${pk_value}' AND A.data_ver = ${max_data_ver.data_ver} AND A.data_sub_ver = ${max_data_ver.data_sub_ver}
        `
    )

    return rs

}

module.exports = selectSubmitPossibleCheck;