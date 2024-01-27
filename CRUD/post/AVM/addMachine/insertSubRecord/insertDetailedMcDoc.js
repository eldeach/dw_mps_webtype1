// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../../../dbconns/maria/thisdb');


async function insertDetailedMcDoc (tbl_name, id_column_name, id_str, values) {
    let affectedRows = 0;
    let handleArr = []
    if ( !values ){
        handleArr = []
    } else {
        handleArr = [...values]
    }

    handleArr.map(async (value, index) =>{

        let perform_start = ''
        let perform_end = ''
    
        if ( !value.perform_date_start ) {
            perform_start = 'NULL'
        } else {
            perform_start = `'${value.perform_date_start}'`
        }
        
        if ( !value.perform_date_end ) {
            perform_end = 'NULL'
        } else {
            perform_end = `'${value.perform_date_end}'`
        }

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
                '${value.doc_author}',
                '${value.author_team}',
                ${perform_start},
                ${perform_end},
                '${value.doc_approval_date}'
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