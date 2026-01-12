const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: message,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

const sendWelcomeEmail = (email, name) => {
  const message = `
    <h2>Welcome to AI Resume Parser!</h2>
    <p>Hi ${name},</p>
    <p>Thank you for registering. Your account is now active and ready to use.</p>
    <p><a href="${process.env.FRONTEND_URL}/dashboard">Start using the app</a></p>
  `;
  return sendEmail(email, 'Welcome to AI Resume Parser', message);
};

const sendResetEmail = (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const message = `
    <h2>Reset Your Password</h2>
    <p><a href="${resetLink}">Click here to reset your password</a></p>
    <p>This link expires in 1 hour.</p>
  `;
  return sendEmail(email, 'Reset Your Password', message);
};

module.exports = { sendEmail, sendWelcomeEmail, sendResetEmail };
