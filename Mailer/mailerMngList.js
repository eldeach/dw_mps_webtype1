// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../dbconns/maria/thisdb');


async function mailerMngList (app) {
    app.get('/mailingmnglist', async function ( req, res ) {
        let rs = await sendQry(`
        SELECT
            M.mng_name,
            ML.*
        FROM mailing_tb_list AS ML
        LEFT OUTER JOIN (SELECT * FROM tb_machine WHERE approval_status = 'APPROVED') AS M
        ON ML.MNG_CODE = M.mng_code
        `)
        res.status(200).json(rs)
    })
}

module.exports = mailerMngList;