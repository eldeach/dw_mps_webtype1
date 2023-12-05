// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');


async function insertDetailedPhone (user_phone_id, values) {
    let affectedRows = 0;
    values.map(async (value, index) =>{
        if ( value.phone_number == '' || !value.phone_number ){

        } else {
            let insertRs = await sendQry(
                `INSERT INTO tb_user_phone (
                    user_phone_id,
                    sort_order,
                    phone_number,
                    phone_usage,
                    phone_affiliation
                )
                VALUES (
                    '${user_phone_id}',
                    ${index},
                    '${value.phone_number}',
                    '${value.phone_usage}',
                    '${value.phone_affiliation}'
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

module.exports = insertDetailedPhone;