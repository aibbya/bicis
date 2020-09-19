
const nodemailer = require('nodemailer');

const mailConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'dee2@ethereal.email',
    pass: 'P2ErftcR98RDeg1N5X'
  }
}

module.exports = nodemailer.createTransport(mailConfig);