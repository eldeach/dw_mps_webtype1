// ======================================================================================== [Import Libaray]
// bcrypt & salt 값 정의
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function changeToHash(plainPW){
    let hashedPw = await bcrypt.hash(plainPW, saltRounds)
    return hashedPw
}

module.exports = changeToHash;