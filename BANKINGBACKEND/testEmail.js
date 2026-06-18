require("dotenv").config();

const sendEmail = require("./src/utils/sendEmail");

(async () => {
  try {
    await sendEmail(
      "uddhavchourasiya123@gmail.com",
      "Bandhan Bank Test Email",
      "<h2>Email Working Successfully ✅</h2>"
    );

    console.log("✅ Test email sent successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Email Error:");
    console.error(err);
    process.exit(1);
  }
})();