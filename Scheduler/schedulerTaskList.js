const mailingGetFacingDeadline = require('../Mailing/mailingGetFacingDeadline').mailingGetFacingDeadline
const testTask1 = require('./testTask1').testTask1
const schedulerTaskList = {
    mailingGetFacingDeadline : testTask1,
}

module.exports = {schedulerTaskList} ;