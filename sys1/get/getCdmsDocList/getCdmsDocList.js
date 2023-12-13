// ======================================================================================== [Import Component] js
// Function
const { sendQry_toCdms } = require ('../../../dbconns/maria/cdmsdb');


function getCdmsDocList (app) {
    app.get('/getcdmsqualdoclist', async function ( req, res ) {

        let rs = await sendQry_toCdms(`
            SELECT
                A.doc_no AS doc_no,
                A.rev_no AS doc_rev_no,
                A.doc_title AS doc_title,
                B.user_name AS doc_author,
                A.written_by_team AS author_team,
                date_format(A.approval_date, '%Y-%m-%d') AS doc_approval_date,
                if(A.invalid_date < '1970-01-02', NULL, date_format(A.invalid_date, '%Y-%m-%d')) AS invalid_date,
                if(A.imp_start_date < '1970-01-02', NULL, date_format(A.imp_start_date, '%Y-%m-%d')) AS perform_date_start,
                if(A.imp_completion_date < '1970-01-02', NULL, date_format(A.imp_completion_date, '%Y-%m-%d')) AS perform_date_end,
                BIN_TO_UUID(A.uuid_binary) AS uuid_binary
            FROM
                tb_doc_list AS A
                LEFT OUTER JOIN tb_groupware_user AS B
                ON A.written_by = B.user_account

            WHERE
                A.${req.query.colName} like '%${req.query.qualAtt}%'
                AND isProtocol = 0
            ORDER BY A.approval_date DESC
        `)
        res.status(200).json(rs)
    })
}

module.exports = getCdmsDocList;