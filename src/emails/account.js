const sgMail = require('@sendgrid/mail');

const sendGridAPIKey =
  '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';

sgMail.setApiKey(sendGridAPIKey);

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
