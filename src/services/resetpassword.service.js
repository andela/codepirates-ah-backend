import 'dotenv/config';
import sgMail from '@sendgrid/mail';

const sendEmail = (email, username, url) => {
  sgMail.setApiKey(process.env.SendGridApiKey);

  const msg = {
    to: `${email}`,
    from: `${process.env.SENDER_EMAIL}`,
    subject: 'How to reset your Author\'s Haven account password.',
    text: 'Follow this link provided to reset your password',
    html: `<div style="width: 90%; margin: 5rem auto; box-shadow: 0 0 10px rgba(0,0,0,.9);">
        <div>
            <div>
                <div style="background-color: #2084ba; height: 3rem; width: 100%">
                    <h2 style="text-align: center; color: white; padding-top: 10px;">Author's Heaven</h2>
                </div>
                <h4 style="text-align: center">Hi! ${username}</h4>
            </div>
            <div style=" padding: 0px 20px 20px 20px">
                <div>
                <p>You are recieving this because you (or someone else) requested the reset of your password for your account</p></br>
                <p>This link is valid for only one hour</p>
                <p>Please click on the link, or paste this into your browser to complete the process</p>
                ${url}
            </div>
            <div>
                <h3 style="text-align: center">Thank you</h3>
            </div>
            </div>
        </div>
    </div>`,
  };
  return sgMail.send(msg);
};
const sendPasswordResetEmailHelper = { sendEmail };
export default sendPasswordResetEmailHelper;
