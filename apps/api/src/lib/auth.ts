import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import nodemailer from 'nodemailer';
import { db } from '../db';
import { verification } from '../db/schema';
import { eq } from 'drizzle-orm';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email: string, name: string): Promise<string> {
  const otp = generateOTP();
  const id = crypto.randomUUID();

  await db.delete(verification).where(eq(verification.identifier, email));

  await db.insert(verification).values({
    id,
    identifier: email,
    value: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to Samriddhi!</h2>
        <p style="color: #666; line-height: 1.6;">
          Hi ${name},<br><br>
          Thank you for registering. Please use the following OTP to verify your email address.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
          </div>
        </div>
        <p style="color: #999; font-size: 12px;">This OTP will expire in 10 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  });

  return otp;
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const record = await db
    .select()
    .from(verification)
    .where(eq(verification.identifier, email))
    .limit(1);

  if (!record.length) return false;

  const verificationRecord = record[0];

  if (new Date() > new Date(verificationRecord.expiresAt)) {
    await db.delete(verification).where(eq(verification.identifier, email));
    return false;
  }

  if (verificationRecord.value !== otp) return false;

  await db.delete(verification).where(eq(verification.identifier, email));

  return true;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'customer',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log('[AUTH] sendVerificationEmail triggered for:', user.email);
        await sendOTP(user.email, user.name);
        console.log('[AUTH] OTP sent successfully to:', user.email);
      } catch (err) {
        console.error('[AUTH] Failed to send OTP:', err);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
});
