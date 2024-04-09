const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to send emails
app.post('/send-email', async (req, res) => {
  try {
    // Extract email data from request body
    const { to, subject, text } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'rishabh.singh@jbmgroup.com', // Your Outlook email address
        pass: 'Gracy@123', // Your Outlook password
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'Your Name <rishabh.singh@jbmgroup.com>',
      to,
      subject,
      text,
    });

    console.log('Email sent: ' + info.response);
    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
