import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

type MailOptions = {
  host?: string;
  port?: number;
  secure?: boolean;
  service?: string;
  auth: {
    user: string | undefined;
    pass: string | undefined;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
};

const buildTransportOptions = (): MailOptions => {
  const authUser = process.env.EMAIL; // SMTP authentication username
  const authPass = (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, ''); // strip spaces from password
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const portEnv = process.env.EMAIL_PORT || process.env.SMTP_PORT;
  const secureEnv = process.env.EMAIL_SECURE || process.env.SMTP_SECURE;
  // const service = process.env.EMAIL_SERVICE;

  if (!authUser || !authPass) {
    throw new Error(
      "SMTP credentials missing: set EMAIL (SMTP username) and EMAIL_PASSWORD (SMTP password) in your .env file."
    );
  }

  // If custom host is provided, use custom SMTP configuration
  if (host) {
    const port = portEnv ? Number(portEnv) : 587;
    const secure = secureEnv ? secureEnv === "true" : port === 465;
    
    return {
      host,
      port,
      secure,
      auth: {
        user: authUser,
        pass: authPass,
      },
      tls: { rejectUnauthorized: false },
    };
  }

  // If service name is provided but no host, use service preset
  // if (service) {
  //   return {
  //     service,
  //     auth: {
  //       user: authUser,
  //       pass: authPass,
  //     },
  //     tls: { rejectUnauthorized: false },
  //   } as MailOptions;
  // }

  // Require explicit SMTP configuration for custom email services
  throw new Error(
    "SMTP configuration missing: set EMAIL_HOST (or SMTP_HOST) and EMAIL_PORT (or SMTP_PORT) for custom email service, or set EMAIL_SERVICE for known services."
  );
};

const transporter = nodemailer.createTransport(buildTransportOptions() as any);

export default transporter;
