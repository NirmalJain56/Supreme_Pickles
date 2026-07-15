const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: 'Supreme Pickles <onboarding@resend.dev>', // resend.dev for testing, user might need to change to their verified domain later
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
