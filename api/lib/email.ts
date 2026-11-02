import tls from 'tls';
import crypto from 'crypto';

const SENDER_EMAIL = process.env.GMAIL_SENDER || process.env.GEARMESH_GMAIL_SENDER || 'shrestheducation1@gmail.com';
const APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.GEARMESH_GMAIL_APP_PASSWORD || 'cxorzxdwqidenyya';
const HMAC_SECRET = process.env.GEARMESH_JWT_SECRET || 'gearmesh-auth-token-secret-2026';

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOtpToken(email: string, otp: string, expiresInMs = 5 * 60 * 1000): string {
  const expiresAt = Date.now() + expiresInMs;
  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${email.trim().toLowerCase()}:${otp.trim()}:${expiresAt}`)
    .digest('hex');
  return `${expiresAt}.${signature}`;
}

export function verifyOtpToken(email: string, otp: string, token: string): { valid: boolean; reason?: string } {
  if (!token || !token.includes('.')) {
    return { valid: false, reason: 'Missing or malformed verification token.' };
  }

  const [expStr, signature] = token.split('.');
  const expiresAt = parseInt(expStr, 10);

  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { valid: false, reason: 'Verification code has expired. Please request a new code.' };
  }

  const expectedSignature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${email.trim().toLowerCase()}:${otp.trim()}:${expiresAt}`)
    .digest('hex');

  if (signature !== expectedSignature) {
    return { valid: false, reason: 'Invalid verification code. Please check the digits and try again.' };
  }

  return { valid: true };
}

export function sendOtpEmail(recipientEmail: string, otpCode: string, userName?: string): Promise<boolean> {
  const target = recipientEmail.trim();
  const safeName = userName && userName.trim() ? userName.trim() : 'Valued Member';
  const subject = `GearMesh Security: Your Verification Code is ${otpCode}`;

  const htmlBody = `<!DOCTYPE html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4EFEA; margin: 0; padding: 32px 16px;">
    <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 1px solid #E5E7EB;">
      <div style="background: #10291F; padding: 28px 24px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">GearMesh</h1>
        <p style="color: #A8B8A3; margin: 6px 0 0; font-size: 13px;">Borrow • Share • Belong</p>
      </div>
      <div style="padding: 32px 28px; text-align: center;">
        <h2 style="color: #111827; margin: 0 0 12px; font-size: 20px;">Two-Factor Authentication</h2>
        <p style="color: #4B5563; font-size: 14px; line-height: 1.5; margin: 0 0 24px;">Hello <strong>${safeName}</strong>,<br/>Use the verification code below to complete your GearMesh sign-in or registration:</p>
        <div style="display: inline-block; background: #FAF8F5; border: 2px solid #1B3B2B; border-radius: 12px; padding: 14px 28px; margin: 0 auto 24px;">
          <span style="font-family: monospace, Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1B3B2B;">${otpCode}</span>
        </div>
        <p style="color: #6B7280; font-size: 13px; margin: 0 0 20px;">⏱️ This one-time code is valid for <strong>5 minutes</strong>. Never share this code with anyone.</p>
        <div style="border-top: 1px solid #E5E7EB; padding-top: 18px; color: #9CA3AF; font-size: 12px;">
          If you did not request this email, please secure your account immediately.<br/>
          © 2026 GearMesh Inc. All rights reserved.
        </div>
      </div>
    </div>
  </body></html>`;

  return new Promise((resolve) => {
    try {
      const socket = tls.connect(465, 'smtp.gmail.com', () => {
        let step = 0;
        let buffer = '';

        socket.on('data', (data) => {
          buffer += data.toString();
          const lines = buffer.split('\r\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line) continue;
            const code = line.slice(0, 3);
            const isFinal = line.charAt(3) === ' ';
            if (!isFinal) continue;

            if (step === 0 && code === '220') {
              step = 1;
              socket.write('EHLO localhost\r\n');
            } else if (step === 1 && code === '250') {
              step = 2;
              socket.write('AUTH LOGIN\r\n');
            } else if (step === 2 && code === '334') {
              step = 3;
              socket.write(Buffer.from(SENDER_EMAIL).toString('base64') + '\r\n');
            } else if (step === 3 && code === '334') {
              step = 4;
              socket.write(Buffer.from(APP_PASSWORD.replace(/\s+/g, '')).toString('base64') + '\r\n');
            } else if (step === 4 && code === '235') {
              step = 5;
              socket.write(`MAIL FROM:<${SENDER_EMAIL}>\r\n`);
            } else if (step === 5 && code === '250') {
              step = 6;
              socket.write(`RCPT TO:<${target}>\r\n`);
            } else if (step === 6 && code === '250') {
              step = 7;
              socket.write('DATA\r\n');
            } else if (step === 7 && code === '354') {
              step = 8;
              const emailMessage = [
                `From: GearMesh Security <${SENDER_EMAIL}>`,
                `To: <${target}>`,
                `Subject: ${subject}`,
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8',
                '',
                htmlBody,
                '.'
              ].join('\r\n') + '\r\n';
              socket.write(emailMessage);
            } else if (step === 8 && code === '250') {
              step = 9;
              socket.write('QUIT\r\n');
              socket.end();
              resolve(true);
              return;
            } else if (code.startsWith('4') || code.startsWith('5')) {
              console.error(`[SMTP ERROR] Step ${step}, Code ${code}: ${line}`);
              socket.destroy();
              resolve(false);
              return;
            }
          }
        });
      });

      socket.on('error', (err) => {
        console.error('[SMTP SOCKET ERROR]', err);
        resolve(false);
      });

      socket.setTimeout(12000, () => {
        socket.destroy();
        resolve(false);
      });
    } catch (err) {
      console.error('[SMTP EXECUTION ERROR]', err);
      resolve(false);
    }
  });
}
