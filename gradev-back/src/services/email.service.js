import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error("SMTP configuration is incomplete.");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
};

const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  const subject = "Reset your Gradev password";

  const text = `
Hello ${name},

We received a request to reset your Gradev password.

Use the following link to reset your password:

${resetUrl}

This link expires in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Gradev Team
  `.trim();

  const safeName = name
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset your Gradev password</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;padding:32px;">
          <h1 style="color:#18181b;margin-top:0;">Gradev</h1>

          <h2 style="color:#27272a;">Reset your password</h2>

          <p style="color:#52525b;">
            Hello ${safeName},
          </p>

          <p style="color:#52525b;line-height:1.6;">
            We received a request to reset your Gradev account password.
            Click the button below to create a new password.
          </p>

          <div style="text-align:center;margin:32px 0;">
            <a
              href="${resetUrl}"
              style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;"
            >
              Reset Password
            </a>
          </div>

          <p style="color:#71717a;font-size:14px;line-height:1.6;">
            This link expires in 15 minutes.
          </p>

          <p style="color:#71717a;font-size:14px;line-height:1.6;">
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />

          <p style="color:#a1a1aa;font-size:12px;">
            Gradev — Student Grading Management System
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

const emailService = {
  sendEmail,
  sendPasswordResetEmail,
};

export default emailService;
