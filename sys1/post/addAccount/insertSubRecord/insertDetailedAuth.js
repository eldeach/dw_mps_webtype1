// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');


async function insertDetailedAuth (user_auth_id, values) {
    let affectedRows = 0;
    values.map(async (value, index) =>{
        if ( value.auth_code == '' || !value.auth_code ){

        } else {
            let insertRs = await sendQry(
                `INSERT INTO tb_user_auth (
                    user_auth_id,
                    auth_code
                )
                VALUES (
                    '${user_auth_id}',
                    '${value.auth_code}'
                )
                `.replace(/\n/g, "")
            ).then(( rs ) => {
                affectedRows += 1;
            })
            .catch(( error ) => {
                console.log( error )
                affectedRows = -1;
            })
        }
    })
    return affectedRows;
}

module.exports = insertDetailedAuth;