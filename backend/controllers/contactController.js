const nodemailer = require('nodemailer');

// Contact Form Submission Handler
const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  // Step 1: Validate form fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Step 2: Debug log to verify .env loading
  console.log("EMAIL_USER from .env:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS from .env:", process.env.EMAIL_PASS);
  console.log("CONTACT_RECEIVER_EMAIL from .env:", process.env.CONTACT_RECEIVER_EMAIL);

  try {
    // Step 3: Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Step 4: Configure email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `Contact Us Message from ${name}`,
      text: `You have received a message from ${name} (${email}):\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">
            This message was sent from the FAT (Fitness Assessment Tracker) contact form.
          </p>
        </div>
      `,
    };

    // Step 5: Send the email
    await transporter.sendMail(mailOptions);

    // Step 6: Return success response
    return res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ message: 'There was an error sending your message. Please try again later.' });
  }
};

module.exports = {
  submitContactForm,
};
