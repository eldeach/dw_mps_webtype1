// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');


async function insertDetailedMcPrmList (id_str, values) {
    let affectedRows = 0;
    console.log(Object.keys(values[0]))
    Object.keys(values[0]).map(async (oneKey, index) =>{
        let insertRs = await sendQry(
            `INSERT INTO tb_prm_list (
                prm_list_id,
                prm_code,
                use_prm                
            )
            VALUES (
                '${id_str}',
                '${oneKey}',
                ${values[0][oneKey]}
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

module.exports = insertDetailedMcPrmList;