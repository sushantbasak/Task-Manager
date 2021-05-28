const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: 'kevinmartin2428@gmail.com',
      from: email,
      subject: 'Thanks for registering in Task App',
      text: `Welcome to the Task Manager app, ${name}. We wish your journey to be fine. `,
    })
    .then((data) => console.log('Successsful Message'))
    .catch((e) => console.log(e.response.body));
};

const sendGoodByeEmail = (email, name) => {
  sgMail
    .send({
      to: 'kevinmartin2428@gmail.com',
      from: email,
      subject: 'Thanks for being a part of Task App',
      text: `Well, we say final goodbye from Task Manager app, ${name}. We wish your journey was fine. `,
    })
    .then((data) => console.log('Successsful Message'))
    .catch((e) => console.log(e.response.body));
};

module.exports = { sendWelcomeEmail, sendGoodByeEmail };
