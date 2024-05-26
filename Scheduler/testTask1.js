const dayjs = require('dayjs');
async function testTask1() {
    console.log(dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"))
}

module.exports = {testTask1}