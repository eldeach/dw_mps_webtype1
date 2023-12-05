// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');


async function insertDetailedPosition (user_position_id, values) {
    let affectedRows = 0;
    values.map(async (value, index) =>{
        if ( value.job_position == '' || !value.job_position ){

        } else {
            let insertRs = await sendQry(
                `INSERT INTO tb_user_position (
                    user_position_id,
                    sort_order,
                    job_position,
                    job_team,
                    job_company,
                    job_description
                )
                VALUES (
                    '${user_position_id}',
                    ${index},
                    '${value.job_position}',
                    '${value.job_team}',
                    '${value.job_company}',
                    '${value.job_description}'
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

module.exports = insertDetailedPosition;