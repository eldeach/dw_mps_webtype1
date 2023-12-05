// ======================================================================================== [Import Component] js
// Function
const { sendQry } = require ('../../../dbconns/maria/thisdb');

// 특정 payload id 값으로 검토/승인자들 목록을 저장해줌
async function insertNewApprovalPayload (approval_payload_id, arrPpayload) {
    let affectedRows = 0;
    arrPpayload.map( async (oneStep, stepIndex) => {
        if ( oneStep.length > 0 ) {
            oneStep.map( async (onePersonnel, personnelIndex) => {
                let jobTeamStr =''
                if ( onePersonnel.job_team ) {
                    jobTeamStr = `'${onePersonnel.job_team}'`
                } else {
                    jobTeamStr = 'NULL'
                }
                await sendQry(`
                    INSERT INTO
                        tb_approval_payload
                    SET
                        approval_payload_id = '${approval_payload_id}',
                        approval_order = ${stepIndex},
                        approval_type = '${onePersonnel.approvalType}',
                        user_account = '${onePersonnel.user_account}',
                        user_name = '${onePersonnel.user_name}',
                        job_team = ${jobTeamStr},
                        chosen_approval = NULL,
                        approval_date_time = NULL,
                        delegated = 0,
                        user_comment = NULL
                `.replace(/\n/g, ""))
                .then(( rs ) => {
                    affectedRows += 1;
                })
                .catch(( error ) => {
                    console.log( error )
                    affectedRows = -1;
                })
            })
        }
    })
    return affectedRows;
}

module.exports = insertNewApprovalPayload;