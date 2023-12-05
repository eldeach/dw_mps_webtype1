// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');


async function insertDetailedEmail (user_email_id, values) {
    let affectedRows = 0;
    values.map(async (value, index) =>{
        if ( value.email_address == '' || !value.email_address ){

        } else {
            let insertRs = await sendQry(
                `INSERT INTO tb_user_email (
                    user_email_id,
                    sort_order,
                    email_address,
                    email_usage,
                    email_affiliation
                )
                VALUES (
                    '${user_email_id}',
                    ${index},
                    '${value.email_address}',
                    '${value.email_usage}',
                    '${value.email_affiliation}'
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

module.exports = insertDetailedEmail;