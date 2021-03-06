const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

exports.transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY,
    },
  })
);
