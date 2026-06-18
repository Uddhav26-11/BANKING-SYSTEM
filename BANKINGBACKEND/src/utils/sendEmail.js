const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000, // 10 sec
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async (
  to,
  subject,
  html
) => {
  console.log("📧 Sending OTP to:", to);

  const info = await transporter.sendMail({
    from: `"Bandhan Bank" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent:", info.messageId);

  return info;
};

module.exports = sendEmail;