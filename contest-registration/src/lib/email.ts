import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize the AWS SES Client
const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

//Sends a verification email containing a secure token link.
export async function sendVerificationEmail(toEmail: string, token: string) {
  // Construct the verification link that will hit our Next.js API
  const verifyLink = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`;

  const params = {
    Source: process.env.EMAIL_FROM as string,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: "Verify your email for the Coding Contest",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <div style="font-family: sans-serif; background-color: #111; color: #fff; padding: 40px; border-radius: 8px; max-width: 600px;">
              <h2 style="color: #fff;">Welcome to the Arena</h2>
              <p style="color: #a1a1aa;">Click the button below to verify your email address and complete your registration.</p>
              <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #fff; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px;">Verify Email</a>
            </div>
          `,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    return response;
  } catch (error) {
    console.error("AWS SES Error:", error);
    throw new Error("Failed to send verification email");
  }
}
