import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD
  }
});

export const otpSend = (email) => {
  try {
    return new Promise(async (resolve, reject) => {
      const otp = `${Math.floor(10000 + Math.random() * 99999)}`;

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Verify you email',
        html: `Your email verification code is: ${otp}`
      };

      await transporter
        .sendMail(mailOptions)
        .then((response) => {
          response.otp = otp;
          resolve(response);
        })
        .catch((err) => {
          console.log('ERROR OTP');
          console.log(err, 'errrrorrrr');
          resolve(err);
        });
    }).catch((err) => {
      reject(err);
    });
  } catch (error) {
    console.log('ERROR OCCURED', error);
  }
};
