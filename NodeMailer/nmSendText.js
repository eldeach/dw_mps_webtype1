const nodemailer = require('nodemailer');

const { MAILER_PORT, MAILER_HOST, MAILER_USER, MAILER_PASS } = process.env;

const transporter = nodemailer.createTransport({
    port: MAILER_PORT,
    host: MAILER_HOST,
    pool: true,
    secure: false,
    requireTLS: true,
    tls: {									
        rejectUnauthorized: false,
     },
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS
    }
});

async function nmSendText(mailMsgs) {

    mailMsgs.map((value, index) => {
        value.from = MAILER_USER
    })

    async function sendMail(ms) {
        try {
            const info = await transporter.sendMail(ms);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.log(error);
        }
    }

    for (const ms of mailMsgs) {
        await sendMail(ms);
    }

}


module.exports = { nmSendText }
