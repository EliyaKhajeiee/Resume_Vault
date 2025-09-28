const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    // Create transporter (you'll need to set these environment variables in Netlify)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail app password
      },
    });

    // Email to support team
    const supportEmailOptions = {
      from: process.env.GMAIL_USER,
      to: 'support@resumeproof.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This message was sent from the Resume Proof contact form.</small></p>
      `,
    };

    // Auto-reply to user
    const autoReplyOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Resume Proof',
      html: `
        <h3>Thank you for your message!</h3>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p><em>"${message}"</em></p>
        <br>
        <p>Best regards,<br>
        The Resume Proof Team</p>
        <hr>
        <p><small>This is an automated response. Please don't reply to this email.</small></p>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(supportEmailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Message sent successfully!'
      }),
    };

  } catch (error) {
    console.error('Contact form error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send message. Please try again later.'
      }),
    };
  }
};