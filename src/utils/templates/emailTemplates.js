
const baseTemplate = (content) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:25px;">

      <h2 style="color:#007bff; margin-bottom:10px;">🏥 HMS - Hospital Management System</h2>

      ${content}

      <hr style="margin-top:30px;" />

      <p style="font-size:12px; color:#888;">
        This is an automated email from HMS. Please do not reply.
      </p>

    </div>
  </div>
  `;
};


const verifyEmailTemplate = (link, name) => {
  const content = `
    <h3>Email Verification</h3>

    <p>Hi ${name || "User"},</p>

    <p>Thank you for registering with HMS.</p>

    <p>Please verify your email by clicking the button below:</p>

    <a href="${link}" 
       style="display:inline-block; padding:12px 20px; background:#28a745; color:#fff; text-decoration:none; border-radius:6px;">
       Verify Email
    </a>

    <p style="margin-top:20px;">Or copy this link:</p>
    <p style="word-break:break-all;">${link}</p>
  `;

  return baseTemplate(content);
};


const resendVerificationTemplate = (link, name) => {
  const content = `
    <h3>Resend Email Verification</h3>

    <p>Hi ${name || "User"},</p>

    <p>You requested to resend your verification email.</p>

    <p>Please click below to verify:</p>

    <a href="${link}" 
       style="display:inline-block; padding:12px 20px; background:#ffc107; color:#000; text-decoration:none; border-radius:6px;">
       Verify Now
    </a>

    <p style="margin-top:20px;">Or copy this link:</p>
    <p style="word-break:break-all;">${link}</p>
  `;

  return baseTemplate(content);
};


const resetPasswordTemplate = (link, name, tempPassword) => {
  const content = `
    <h3 style="color:#dc3545;">Reset Your Password</h3>

    <p>Hi ${name || "User"},</p>

    <p>We received a request to reset your password.</p>

    <p><strong>Your Temporary Password:</strong></p>
    <p style="font-size:18px; font-weight:bold; color:#000;">
      ${tempPassword}
    </p>

    <p>Please use this temporary password and click the button below to set your new password:</p>

    <a href="${link}" 
       style="display:inline-block; padding:12px 20px; background:#dc3545; color:#fff; text-decoration:none; border-radius:6px;">
       Reset Password
    </a>

    <p style="margin-top:20px;">Or copy this link:</p>
    <p style="word-break:break-all;">${link}</p>

    <p style="margin-top:20px;">
      🔐 For security reasons, this link will expire soon.
    </p>

    <p style="margin-top:10px; color:#888; font-size:13px;">
      After resetting your password, this temporary password will no longer be valid.
    </p>
  `;

  return baseTemplate(content);
};


const adminAccountTemplate = ({ name, email, password, resetUrl }) => {

const content = ` <h3 style="color:#1976d2;">Admin Account Created</h3>
<p>Hi ${name || "Admin"},</p>

<p>Your <b>Admin account</b> has been successfully created in HMS.</p>

<div style="background:#f1f5f9; padding:15px; border-radius:8px; margin:15px 0;">
  <p style="margin:5px 0;"><b>Email:</b> ${email}</p>
  <p style="margin:5px 0;"><b>Temporary Password:</b> ${password}</p>
</div>

<p>Please click the button below to set your password:</p>

<a href="${resetUrl}" 
   style="display:inline-block; padding:12px 20px; background:#1976d2; color:#fff; text-decoration:none; border-radius:6px;">
   Set Password
</a>

<p style="margin-top:20px;">Or copy this link:</p>
<p style="word-break:break-all;">${resetUrl}</p>

<p style="margin-top:20px; font-size:13px; color:#777;">
  This link will expire in 1 hour.
</p>

<p style="font-size:13px; color:#888;">
  If you did not expect this email, please ignore it.
</p>

`;

return baseTemplate(content);
};

const patientAccountTemplate = ({ name, email, password, loginUrl }) => {
  const content = `
    <h3 style="color:#007bff;">Patient Account Created</h3>

    <p>Hi ${name || "Patient"},</p>

    <p>Your account has been created by our hospital team.</p>

    <p>Please use the below credentials to login:</p>

    <div style="background:#f1f5f9; padding:15px; border-radius:8px; margin:15px 0;">
      <p style="margin:5px 0;"><b>Email:</b> ${email}</p>
      <p style="margin:5px 0;"><b>Password:</b> ${password}</p>
    </div>

    <p>Click the button below to login:</p>

    <a href="${loginUrl}" 
       style="display:inline-block; padding:12px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:6px;">
       Login to HMS
    </a>

    <p style="margin-top:20px;">Or copy this link:</p>
    <p style="word-break:break-all;">${loginUrl}</p>

    <p style="margin-top:20px; color:#dc3545;">
      ⚠️ Please change your password after login for security.
    </p>
  `;

  return baseTemplate(content);
};


module.exports = {
  verifyEmailTemplate,
  resendVerificationTemplate,
  adminAccountTemplate,
  resetPasswordTemplate,
  patientAccountTemplate,
};