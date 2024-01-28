// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require('../../../../../dbconns/maria/thisdb');


async function getPrmDocs(app) {

    app.get('/getprmdocs', async function (req, res) {
        let rs = await sendQry(`
        SELECT
            ${req.query.prm_id_col_name},
            min_value,
            max_value,
            doc_no,
            doc_rev_no,
            doc_title,
            doc_author,
            author_team,
            date_format(perform_date_start, '%Y-%m-%d') AS perform_date_start,
            date_format(perform_date_end, '%Y-%m-%d') AS perform_date_end,
            date_format(doc_approval_date, '%Y-%m-%d') AS doc_approval_date
        FROM
            ${req.query.prm_tbl_name}
        WHERE
            ${req.query.prm_id_col_name} = (SELECT ${req.query.prm_id_col_name} FROM tb_machine WHERE mng_code = "${req.query.mng_code}" AND data_ver = ${req.query.data_ver} AND approval_status = "APPROVED")
        `.replace(/\n/g, ""))
        res.status(200).json(rs)
    })
}

module.exports = getPrmDocs;