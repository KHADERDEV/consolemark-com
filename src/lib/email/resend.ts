import "server-only";

type RentRequestEmail = {
  requestCode: string;
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

type TransferRequestEmail = {
  requestCode: string;
  developerAccountId: string;
  transactionId: string;
  appNames: string[];
  packageNames: string[];
  whatsappNumber: string;
  userEmail?: string;
  consoleName: string;
  consoleUrl: string;
  rentConsoleId: string;
};

type PaymentDueEmail = {
  to: string[];
  requestCode: string;
  paymentLabel: string;
  dueDate: string;
  amount?: string | null;
  note?: string | null;
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
        <p><strong>Request ID:</strong> ${details.requestCode}</p>
        <p><strong>Console:</strong> ${details.consoleName}</p>
        <p><strong>Console ID:</strong> ${details.rentConsoleId}</p>
        <p><strong>Console URL:</strong> <a href="${details.consoleUrl}">${details.consoleUrl}</a></p>
        <p><strong>User:</strong> ${details.userEmail ?? "Unknown"}</p>
        <p><strong>App/Game Name:</strong> ${details.appName}</p>
        <p><strong>Package Name:</strong> ${details.packageName}</p>
        <p><strong>Submission Type:</strong> ${details.submissionType}</p>
        <p><strong>Free/Paid:</strong> ${details.pricingType}</p>
        <p><strong>Email:</strong> ${details.gmail}</p>
        <p><strong>WhatsApp:</strong> ${details.whatsappNumber}</p>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend failed: ${response.status} ${message}`);
  }
}

export async function sendTransferRequestEmail(details: TransferRequestEmail) {
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
      from: "Console Mark <transfer@consolemark.com>",
      to: ["transfer@consolemark.com"],
      subject: `New transfer request: ${details.appNames.join(", ")}`,
      html: `
        <h1>New transfer request</h1>
        <p><strong>Request ID:</strong> ${details.requestCode}</p>
        <p><strong>Console:</strong> ${details.consoleName}</p>
        <p><strong>Console ID:</strong> ${details.rentConsoleId}</p>
        <p><strong>Console URL:</strong> <a href="${details.consoleUrl}">${details.consoleUrl}</a></p>
        <p><strong>User:</strong> ${details.userEmail ?? "Unknown"}</p>
        <p><strong>Developer Account ID:</strong> ${details.developerAccountId}</p>
        <p><strong>Transaction / Verification Code:</strong> ${details.transactionId}</p>
        <p><strong>App Names:</strong> ${details.appNames.join(", ")}</p>
        <p><strong>Package Names:</strong> ${details.packageNames.join(", ")}</p>
        <p><strong>WhatsApp:</strong> ${details.whatsappNumber}</p>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend failed: ${response.status} ${message}`);
  }
}

export async function sendPaymentDueEmail(details: PaymentDueEmail) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const recipients = Array.from(new Set(details.to.filter(Boolean)));

  if (recipients.length === 0) {
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Console Mark <payment@consolemark.com>",
      to: recipients,
      subject: `Payment due for ${details.requestCode}`,
      html: `
        <h1>Payment due</h1>
        <p><strong>Request ID:</strong> ${details.requestCode}</p>
        <p><strong>Payment:</strong> ${details.paymentLabel}</p>
        <p><strong>Due date:</strong> ${details.dueDate}</p>
        <p><strong>Amount:</strong> ${details.amount ?? "Not specified"}</p>
        <p><strong>Note:</strong> ${details.note ?? ""}</p>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend failed: ${response.status} ${message}`);
  }
}
