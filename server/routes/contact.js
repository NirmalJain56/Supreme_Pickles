const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

// @route  POST /api/contact
// @desc   Send contact form message to owner's email
// @access Public
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Perk Foodz Contact <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL],
      reply_to: email,
      subject: `[Perk Foodz] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              body { font-family: Arial, sans-serif; background: #fdf8f2; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
              .header { background: linear-gradient(135deg, #c8922a, #8b1a1a); padding: 28px 32px; }
              .header h1 { color: #fff; margin: 0; font-size: 22px; }
              .header p { color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px; }
              .body { padding: 32px; }
              .field { margin-bottom: 20px; }
              .label { font-size: 11px; font-weight: 700; color: #c8922a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
              .value { font-size: 15px; color: #333; background: #fdf8f2; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #c8922a; }
              .message-value { white-space: pre-wrap; line-height: 1.6; }
              .footer { background: #1a1a1a; padding: 18px 32px; text-align: center; }
              .footer p { color: #888; font-size: 12px; margin: 0; }
              .badge { display: inline-block; background: #c8922a; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: 6px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <span class="badge">📩 New Message</span>
                <h1>Someone reached out to you!</h1>
                <p>Via Perk Foodz Contact Form</p>
              </div>
              <div class="body">
                <div class="field">
                  <div class="label">👤 Full Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">📧 Email Address</div>
                  <div class="value"><a href="mailto:${email}" style="color:#c8922a;">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">📌 Subject</div>
                  <div class="value">${subject}</div>
                </div>
                <div class="field">
                  <div class="label">💬 Message</div>
                  <div class="value message-value">${message}</div>
                </div>
              </div>
              <div class="footer">
                <p>Perk Foodz • Sikar Road, Jaipur, Rajasthan — 302013 • +91 97838 15582</p>
                <p style="margin-top:6px;">To reply, simply reply to this email — it goes directly to ${email}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
    }

    console.log('✅ Contact email sent:', data?.id);
    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
