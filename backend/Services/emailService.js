const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendWelcomeEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: "Job Portal" <${process.env.EMAIL_USER}>,
      to,
      subject: 'Welcome to Job Portal',
      html: <h1>Hello ${name}</h1><p>Your account was created successfully!</p>
    });
    logger.info(Welcome email sent to ${to});
  } catch (err) {
    logger.error(Email error: ${err.message});
  }
};

exports.sendPasswordResetEmail = async (to, token) => {
  // Implementation for password reset
};