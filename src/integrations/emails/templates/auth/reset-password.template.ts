/* eslint-disable prettier/prettier */
export function resetPasswordTemplate(payload: { userName: string; resetPasswordLink: string }) {
  const { userName, resetPasswordLink } = payload;

  const template = `
<html>
  <body style="background-color: #f9fafb; font-family: Arial, sans-serif; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); padding: 20px;">

      <h1 style="color: #613506; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;">
        Password Reset Request
      </h1>
      <p style="color: #41672d; font-size: 16px; text-align: center; margin-bottom: 20px;">
        Hello ${userName},
      </p>
      <p style="color: #333; font-size: 14px; text-align: center; margin-bottom: 20px;">
        We received a request to reset your password. If this was you, please click the button below to set a new password.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPasswordLink}" 
           style="display: inline-block; background-color: #613506; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
        If you did not request this, please ignore this email. Your account remains secure.
      </p>
      <div style="color: #999; font-size: 12px; text-align: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
        Need help? Contact our support team at <a href="mailto:support@example.com" style="color: #077091; text-decoration: underline;">support@example.com</a>
      </div>
    </div>
  </body>
</html>
  `;
  return template;
}
