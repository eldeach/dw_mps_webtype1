// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../dbconns/maria/thisdb');


async function insertDetailedMcDoc (tbl_name, id_column_name, id_str, values) {
    let affectedRows = 0;
    values.map(async (value, index) =>{
        let insertRs = await sendQry(
            `INSERT INTO ${tbl_name} (
                ${id_column_name},
                doc_no,
                doc_rev_no,
                doc_title,
                doc_author,
                author_team,
                perform_date_start,
                perform_date_end,
                doc_approval_date
            )
            VALUES (
                '${id_str}',
                '${value.doc_no}',
                '${value.doc_rev_no}',
                '${value.doc_title}',
                '${value.user_name}',
                '${value.written_by_team}',
                '${value.imp_start_date}',
                '${value.imp_completion_date}',
                '${value.approval_date}'
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

module.exports = insertDetailedMcDoc;