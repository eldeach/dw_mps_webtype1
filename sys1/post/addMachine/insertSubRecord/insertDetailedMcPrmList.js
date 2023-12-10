// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');


async function insertDetailedMcPrm (id_str, values) {
    let affectedRows = 0;
    values.map(async (value, index) =>{
        let insertRs = await sendQry(
            `INSERT INTO tb_prm_list (
                prm_list_id,
                prm_code,
                use_prm                
            )
            VALUES (
                '${id_str}',
                ${value.minValue},
                ${value.maxValue}
            )
            `.replace(/\n/g, "")
        ).then(( rs ) => {
            affectedRows += 1;
        })
        .catch(( error ) => {
            console.log( error )
            affectedRows = -1;
        })
    })
    return affectedRows;
}

module.exports = insertDetailedMcPrm;