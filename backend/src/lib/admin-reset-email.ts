import nodemailer from 'nodemailer';

import { env } from '../config/env';

type SendAdminResetCodeEmailParams = {
  code: string;
  expiresInMinutes: number;
  toEmail: string;
};

let smtpTransporter: nodemailer.Transporter | null = null;

function hasSmtpConfig(): boolean {
  return Boolean(
    env.SMTP_HOST &&
      env.SMTP_PORT &&
      env.SMTP_USER &&
      env.SMTP_PASSWORD &&
      env.SMTP_FROM_EMAIL
  );
}

function getSmtpTransporter(): nodemailer.Transporter {
  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  return smtpTransporter;
}

function getFromHeader(): string {
  if (env.SMTP_FROM_NAME) {
    return `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`;
  }

  return env.SMTP_FROM_EMAIL!;
}

export async function sendAdminResetCodeEmail({
  code,
  expiresInMinutes,
  toEmail,
}: SendAdminResetCodeEmailParams): Promise<void> {
  if (!hasSmtpConfig()) {
    if (env.NODE_ENV === 'production') {
      throw new Error('SMTP configuration is missing in production.');
    }

    console.info(`[admin-auth] reset code for ${toEmail}: ${code}`);
    return;
  }

  const transporter = getSmtpTransporter();

  await transporter.sendMail({
    from: getFromHeader(),
    to: toEmail,
    subject: 'Code de réinitialisation Maxwell Admin',
    text: `Votre code de réinitialisation est ${code}. Il expire dans ${expiresInMinutes} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
        <p>Bonjour,</p>
        <p>Voici votre code de réinitialisation Maxwell Admin :</p>
        <p style="font-size: 28px; letter-spacing: 8px; font-weight: 700; margin: 16px 0;">${code}</p>
        <p>Ce code expire dans ${expiresInMinutes} minutes.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  });
}


