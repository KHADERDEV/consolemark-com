import "server-only";

type RentRequestEmail = {
  appName: string;
  packageName: string;
  submissionType: string;
  pricingType: string;
  gmail: string;
  whatsappNumber: string;
  userEmail?: string;
  consoleName: string;
  consoleUrl: string;
  rentConsoleId: string;
};

export async function sendRentRequestEmail(details: RentRequestEmail) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Console Mark <rent@consolemark.com>",
      to: ["rent@consolemark.com"],
      subject: `New rent request: ${details.appName}`,
      html: `
        <h1>New rent request</h1>
        <p><strong>Console:</strong> ${details.consoleName}</p>
        <p><strong>Console ID:</strong> ${details.rentConsoleId}</p>
        <p><strong>Console URL:</strong> <a href="${details.consoleUrl}">${details.consoleUrl}</a></p>
        <p><strong>User:</strong> ${details.userEmail ?? "Unknown"}</p>
        <p><strong>App/Game Name:</strong> ${details.appName}</p>
        <p><strong>Package Name:</strong> ${details.packageName}</p>
        <p><strong>Submission Type:</strong> ${details.submissionType}</p>
        <p><strong>Free/Paid:</strong> ${details.pricingType}</p>
        <p><strong>Gmail:</strong> ${details.gmail}</p>
        <p><strong>WhatsApp:</strong> ${details.whatsappNumber}</p>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend failed: ${response.status} ${message}`);
  }
}
