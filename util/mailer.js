const nodemailer = require("nodemailer");
//App Pass tren gg : zjvl rhcl wkzz hqhy


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "ngocsmile944@gmail.com",
        pass: "zjvl rhcl wkzz hqhy",
    },
});

const sendMail = async (data) => {
    try {
        const { email, subject, content } = data;
        const infor = {
            from: '"Nodejs 👻" <ngocsmile944@gmail.com>', // sender address
            to: email,// list of receivers
            subject: "Hello ✔", // Subject line
            html: "<b>Hello world?</b>", // html body
        };
        await transporter.sendMail(infor);
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendMail }