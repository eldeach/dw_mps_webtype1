// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');



function getProductList (app) {
    app.get('/getproductList', async function ( req, res ) {
        let whereSat=''
        if ( Array.isArray(req.query.approval_status)) {
            let tempArr = []
            req.query.approval_status.map((stValue, index) => {
                tempArr.push(`approval_status = '${stValue}'`)
            })
            whereSat = tempArr.join(' OR ')
        } else {
            whereSat = `approval_status = '${req.query.approval_status}'`
        }
        let rs = await sendQry(`
        SELECT
            BIN_TO_UUID(THIS_TBL.uuid_binary) AS uuid_binary,
            THIS_TBL.data_ver AS data_ver,
            THIS_TBL.data_sub_ver AS data_sub_ver,
            THIS_TBL.approval_status AS approval_status,
            THIS_TBL.remark AS remark,
            THIS_TBL.revision_history AS revision_history,
            THIS_TBL.approval_payload_id AS approval_payload_id,
            THIS_TBL.previous_approval_payload_id AS previous_approval_payload_id,
            THIS_TBL.mng_code AS mng_code,
            THIS_TBL.mng_code_alt AS mng_code_alt,
            THIS_TBL.mng_code_alt2 AS mng_code_alt2,
            THIS_TBL.mng_name AS mng_name,
            THIS_TBL.periodic_mng_pv AS periodic_mng_pv,
            DOC_A.prod_periodic_pv AS prod_periodic_pv,
            DOC_B.prod_pv AS prod_pv
        FROM
            (SELECT *
            FROM
                tb_prod
            WHERE ${whereSat} ) AS THIS_TBL
            LEFT OUTER JOIN
            (SELECT
                prod_periodic_pv_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prod_periodic_pv_id":"', if(ISNULL(prod_periodic_pv_id),'',prod_periodic_pv_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if((perform_date_start < '1970-01-02' OR perform_date_start IS NULL), '', date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if((perform_date_end < '1970-01-02' OR perform_date_end IS NULL), '', date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if((doc_approval_date < '1970-01-02' OR doc_approval_date IS NULL), '', date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prod_periodic_pv
            FROM tb_prod_periodic_pv GROUP BY prod_periodic_pv_id) AS DOC_A ON THIS_TBL.prod_periodic_pv_id = DOC_A.prod_periodic_pv_id
            LEFT OUTER JOIN
            (SELECT
                prod_pv_id,
                CONCAT('[',
                    GROUP_CONCAT(
                        CONCAT('{',
                        CONCAT('"prod_pv_id":"', if(ISNULL(prod_pv_id),'',prod_pv_id),'",'),
                        CONCAT('"doc_no":"', if(ISNULL(doc_no),'',doc_no),'",'),
                        CONCAT('"doc_rev_no":', if(ISNULL(doc_rev_no),null,doc_rev_no),','),
                        CONCAT('"doc_title":"', if(ISNULL(doc_title),'',doc_title),'",'),
                        CONCAT('"doc_author":"', if(ISNULL(doc_author),'',doc_author),'",'),
                        CONCAT('"author_team":"', if(ISNULL(author_team),'',author_team),'",'),
                        CONCAT('"perform_date_start":"', if((perform_date_start < '1970-01-02' OR perform_date_start IS NULL), '', date_format(perform_date_start, '%Y-%m-%d')),'",'),
                        CONCAT('"perform_date_end":"', if((perform_date_end < '1970-01-02' OR perform_date_end IS NULL), '', date_format(perform_date_end, '%Y-%m-%d')),'",'),
                        CONCAT('"doc_approval_date":"', if((doc_approval_date < '1970-01-02' OR doc_approval_date IS NULL), '', date_format(doc_approval_date, '%Y-%m-%d')),'"'),
                    '}') SEPARATOR ","),
                ']') AS prod_pv
            FROM tb_prod_pv GROUP BY prod_pv_id) AS DOC_B ON THIS_TBL.prod_pv_id = DOC_B.prod_pv_id


        `)
        res.status(200).json(rs)
    })
}

module.exports = getProductList;