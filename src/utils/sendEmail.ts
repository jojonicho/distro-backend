import nodemailer from "nodemailer";

export async function sendEmail(email: string, url: string) {
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  const mailOptions = {
    from: "Jonathan Nicholas <jojonicho181@gmail.com>",
    to: email,
    subject: "Nodemailer!",
    text: "This is nodemailer",
    html: `Click to confirm <a href="${url}">${url}</a>`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent %s", info.messageId);
  console.log("preview url: %s", nodemailer.getTestMessageUrl(info));
}
