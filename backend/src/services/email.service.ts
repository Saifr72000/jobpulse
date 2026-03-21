import Mailjet from "node-mailjet";

const MAILJET_API_KEY = process.env.MAILJET_API_KEY || "";
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY || "";
const FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || "noreply@jobpulse.com";
const FROM_NAME = process.env.MAILJET_FROM_NAME || "JobPulse";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Initialize Mailjet
let mailjet: any = null;
if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
  mailjet = Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY);
} else {
  console.warn(
    "MAILJET_API_KEY or MAILJET_SECRET_KEY not set. Emails will be logged to console instead.",
  );
}

/**
 * Send invitation email to new user with magic link to set password
 */
export const sendInvitationEmail = async (
  email: string,
  firstName: string,
  token: string,
  companyName: string,
): Promise<void> => {
  const setPasswordUrl = `${CLIENT_URL}/set-password?token=${token}`;

  const subject = `You've been invited to join ${companyName} on JobPulse`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background: #2c2755;
            color: #ffffff;
            padding: 32px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 32px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 16px;
          }
          .message {
            color: #666;
            margin-bottom: 24px;
          }
          .button-container {
            text-align: center;
            margin: 32px 0;
          }
          .button {
            display: inline-block;
            background: #7c3aed;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 24px;
            font-weight: 500;
            font-size: 16px;
          }
          .button:hover {
            background: #6d28d9;
          }
          .info-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .info-box p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
          }
          .footer {
            background: #f9fafb;
            padding: 24px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .footer a {
            color: #7c3aed;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>JobPulse</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Hi ${firstName},</div>
            
            <p class="message">
              You've been invited to join <strong>${companyName}</strong> on JobPulse.
            </p>
            
            <p class="message">
              JobPulse helps your team manage recruitment campaigns and track candidates efficiently. 
              Click the button below to set your password and activate your account:
            </p>
            
            <div class="button-container">
              <a href="${setPasswordUrl}" class="button">Set Password & Get Started</a>
            </div>
            
            <div class="info-box">
              <p><strong>Note:</strong> This invitation link will expire in 48 hours.</p>
            </div>
            
            <p class="message" style="font-size: 14px; color: #9ca3af;">
              If you didn't expect this email, you can safely ignore it.
            </p>
          </div>
          
          <div class="footer">
            <p>
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${setPasswordUrl}">${setPasswordUrl}</a>
            </p>
            <p style="margin-top: 16px;">
              © 2026 JobPulse. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Hi ${firstName},

You've been invited to join ${companyName} on JobPulse.

Click the link below to set your password and activate your account:
${setPasswordUrl}

This link will expire in 48 hours.

If you didn't expect this email, you can safely ignore it.

---
JobPulse Team
  `;

  try {
    if (mailjet) {
      // Send email via Mailjet
      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: FROM_EMAIL,
              Name: FROM_NAME,
            },
            To: [
              {
                Email: email,
                Name: firstName,
              },
            ],
            Subject: subject,
            TextPart: textContent,
            HTMLPart: htmlContent,
          },
        ],
      });

      console.log(`Invitation email sent to ${email} via Mailjet`);
    } else {
      // Development mode - log email instead of sending
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("EMAIL (Development Mode - Not Actually Sent)");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`To: ${email}`);
      console.log(`From: ${FROM_NAME} <${FROM_EMAIL}>`);
      console.log(`Subject: ${subject}`);
      console.log("\nSet Password Link:");
      console.log(`🔗 ${setPasswordUrl}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    }
  } catch (error) {
    console.error("❌ Failed to send invitation email:", error);
    throw new Error("Failed to send invitation email");
  }
};
