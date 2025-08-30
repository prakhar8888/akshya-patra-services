import nodemailer from 'nodemailer';
import chalk from 'chalk';

// --- Enterprise Best Practice: Create the transporter once and reuse it ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generates the final HTML for an email based on a template and context.
 * @param {string} template - The name of the template to use.
 * @param {object} context - The data to inject into the template.
 * @returns {string} The final HTML content.
 */
const generateHtml = (template, context) => {
  // A more advanced system would read .html files from a /templates directory.
  // For simplicity and portability, we'll define our templates here.
  const brandColor = '#10B981'; // Emerald 500 from Tailwind

  let subject = '';
  let html = '';

  const header = `
    <div style="background-color: ${brandColor}; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-family: Arial, sans-serif;">Akshaya Patra Services</h1>
    </div>
  `;
  const footer = `
    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-family: Arial, sans-serif; font-size: 12px;">
      <p>This is an automated message. Please do not reply directly to this email.</p>
      <p>&copy; ${new Date().getFullYear()} Akshaya Patra Services. All rights reserved.</p>
    </div>
  `;

  const bodyStyle = `padding: 30px; color: #374151; font-family: Arial, sans-serif; line-height: 1.6;`;

  switch (template) {
    case 'accountApproved':
      subject = 'Your Account has been Approved!';
      html = `
        <p>Hello ${context.name},</p>
        <p>Congratulations! Your account for the Akshaya Patra Services HRMS has been approved by an administrator. You can now log in and access your dashboard.</p>
        <a href="${context.loginUrl}" style="display: inline-block; background-color: ${brandColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Login to Your Account</a>
      `;
      break;

    case 'accountRejected':
      subject = 'Your Account Request Status';
      html = `
        <p>Hello ${context.name},</p>
        <p>We regret to inform you that your request for an account on the Akshaya Patra Services HRMS has been denied at this time.</p>
      `;
      break;

    case 'newAdminSignUp':
        subject = 'New Admin Sign-up Request';
        html = `
            <p>Hello Super Admin,</p>
            <p>A new user, <strong>${context.name}</strong> (${context.email}), has signed up as an Admin and is awaiting your approval.</p>
            <p>Please log in to the Super Admin panel to review and approve their account.</p>
        `;
        break;

    default: // Generic email
      subject = context.subject;
      html = context.body; // Fallback to raw body if no template matches
  }

  const fullHtml = `
    <div style="max-width: 600px; margin: 20px auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      ${header}
      <div style="${bodyStyle}">
        ${html}
      </div>
      ${footer}
    </div>
  `;

  return { subject, html: fullHtml };
};


/**
 * A reusable service to configure and send templated emails.
 * @param {object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.template - The name of the template to use.
 * @param {object} options.context - The data to pass to the template.
 */
const sendEmail = async (options) => {
  try {
    const { subject, html } = generateHtml(options.template, options.context);

    const mailOptions = {
      from: `"Akshaya Patra Services" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(chalk.cyan(`Email sent successfully to ${options.to}. Message ID: ${info.messageId}`));
    return info;
  } catch (error) {
    console.error(chalk.red.bold('Error sending email:'), error);
    // Re-throw the error so the calling function knows it failed
    throw new Error('Email could not be sent.');
  }
};

export default sendEmail;
