import 'dotenv/config';

const sgMail = require('@sendgrid/mail');

const sendEmail = (email, username, url) => {
  sgMail.setApiKey(process.env.SendGridApiKey);

  const msg = {
    to: `${email}`,
    from: `${process.env.SENDER_EMAIL}`,
    subject: 'Verification email from Authtor\'s Heaven',
    text: 'Please confirm your email',
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
                <p>Please verify that your email <strong>${email}</strong> you used when signing up for the Author's Heaven exists.</p>
                <p>Click on the button below to verify.</p>
                <button style="color: white; background-color: #2084ba; border: none; border-radius: 10px; padding: 5px;"><a  href="${url}" style="text-decoration: none; color: white;">verify Account</a></button>
            </div>
            <div>
                <h3 style="text-align: center">Thank you</h3>
            </div>
            </div>
        </div>
    </div>`,
  };
  return process.env.NODE_ENV === 'test' ? true : sgMail.send(msg);
};

export default sendEmail;
