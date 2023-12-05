// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');

async function insertNewIdNumber (idColName, tblName, idKeyword) {
    // 키워드_#id 패턴만 사용 가능하며 id 테이블에 id 컬럼만 있어야함, 신규 id값을 패턴(idKeyword)에 맞게 발행해줌
    let rs = await sendQry(
        `SELECT MAX(CAST(REPLACE( ${idColName}, '${idKeyword}', '') AS INT)) AS max_no FROM ${tblName}`
    )
    let newId = idKeyword.concat(parseInt(rs[0].max_no) + 1)
    let inputRs = await sendQry(
        `INSERT INTO `.concat(tblName)
        .concat(` (`).concat(idColName).concat(`) `)
        .concat(`VALUES ('`).concat(newId).concat(`')`)
    )
    return newId;
}

module.exports = insertNewIdNumber;