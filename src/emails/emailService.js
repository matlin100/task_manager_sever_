const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { Readable } = require('stream');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cymatlin@gmail.com',
    pass: 'zfkiceodsysazwjn'
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const logoData = await mongoose.connection.db.collection('logo').findOne({ });

    if (!logoData || !logoData.imagePath) {
      console.log('No logo found or invalid logo data');
      return;
    }

    const logoBuffer = Buffer.from(logoData.imagePath.buffer);

    const logoStream = new Readable();
    logoStream.push(logoBuffer);
    logoStream.push(null);

    const mailOptions = {
      from: 'cymatlin@gmail.com',
      to,
      subject,
      text,
      html: `<p  style="font-size: 18px; color:blue "> ${text}</p> <img src="cid:logoImage" alt="Logo">`,
      attachments: [{
        filename: 'logo.png',
        content: logoStream,
        cid: 'logoImage'
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error occurred while sending email:', error);
      } else {
        console.log('Email sent successfully!', info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendEmail
};
