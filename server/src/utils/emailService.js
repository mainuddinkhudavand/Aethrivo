export const sendVerificationEmail = async (email, token, memberId) => {
  const verifyUrl = `${process.env.CLIENT_BASE_URL || 'http://localhost:5173'}/verify-email?token=${token}&memberId=${memberId}`;
  console.log(`\n📧 VERIFICATION EMAIL (stub)\n  To: ${email}\n  Link: ${verifyUrl}\n`);
  return true;
};

export const sendEmail = async ({ to, subject, body }) => {
  console.log(`\n📧 EMAIL (stub)\n  To: ${to}\n  Subject: ${subject}\n  Body: ${body}\n`);
  return true;
};
