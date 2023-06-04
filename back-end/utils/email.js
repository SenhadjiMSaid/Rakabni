const nodemailer = require("nodemailer");
const fs = require("fs");
// const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name;
    this.from = `WASSELNI <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(subject, text, ht) {
    const html = ht;
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
      html,
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const subject = "Welcome to the WASSELNI Family!";

    const text = `Dear ${this.firstName},\n\nWelcome to the WASSELNI Family! Please click on the following link to get started:\n${this.url}\n\nBest regards,\nWASSELNI Team`;

    const html = fs.readFileSync(
      "back-end/public/html/welcomemail.html",
      "utf8"
    );
    const modifiedHtml = html.replace("{{url}}", this.url);
    //reste a le remplacer dans le html jcp comment faire
    await this.send(subject, text, modifiedHtml);
  }

  async sendPasswordReset() {
    const subject = `Your password reset token (valid for only 10 minutes)`;

    const text = `Dear ${this.firstName},\n\nYou have requested to reset your password. Please click on the following link to reset it (valid for only 10 minutes):\n${this.url}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nWASSELNI Team`;

    const html1 = fs.readFileSync(
      "back-end/public/html/réinitialisermdp.html",
      "utf8"
    );
    const modifiedHtml = html1.replace("{{url}}", this.url);

    await this.send(subject, text, modifiedHtml);
  }
  async Trajetannuler() {
    const subject = `Trajet annuler !`;

    const text = `Narvé de vous annoncer que votre conducteur a annuler son trajet pour des raisons inconnu , vous pouvais encore trouver un nv trajet dans notre site web : ${this.url}`;

    await this.send(subject, text);
  }
};
