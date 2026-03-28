import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "tech@jobpulse.no";
const FROM_NAME = process.env.FROM_NAME || "JobPulse";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

let resend: Resend | null = null;
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else {
  console.warn(
    "RESEND_API_KEY not set. Emails will be logged to console instead.",
  );
}

export interface OrderConfirmationParams {
  email: string;
  customerName: string;
  companyName: string;
  orderId: string;
  orderDate: Date;
  campaignName: string;
  orderType: "custom" | "package";
  channels: string[];
  addons: string[];
  paymentMethod: string;
  /** Subtotal excluding VAT (stored as totalAmount in DB) */
  subtotal: number;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  "value-card": "Value card",
  "card-payment": "Card payment",
  invoice: "Invoice",
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString("nb-NO");
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Send order confirmation email after a campaign order is placed.
 * Uses the "jobpulse-order-confirmation" template published in the Resend dashboard.
 */
export const sendOrderConfirmationEmail = async (
  params: OrderConfirmationParams,
): Promise<void> => {
  const {
    email,
    customerName,
    companyName,
    orderId,
    orderDate,
    campaignName,
    orderType,
    channels,
    addons,
    paymentMethod,
    subtotal,
  } = params;

  const vat = Math.round(subtotal * 0.25);
  const total = subtotal + vat;
  const subject = `Order confirmed — ${campaignName}`;

  const variables = {
    CUSTOMER_NAME: customerName,
    COMPANY_NAME: companyName,
    ORDER_ID: orderId,
    ORDER_DATE: formatDate(orderDate),
    CAMPAIGN_NAME: campaignName,
    ORDER_TYPE: orderType === "package" ? "Package plan" : "Custom plan",
    CHANNELS: channels
      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
      .join(", "),
    ADDONS: addons.length
      ? addons
          .map((a) =>
            a.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          )
          .join(", ")
      : "None",
    PAYMENT_METHOD: PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod,
    SUBTOTAL: formatCurrency(subtotal),
    VAT: formatCurrency(vat),
    TOTAL: formatCurrency(total),
    DASHBOARD_URL: `${CLIENT_URL}/campaigns`,
  };

  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [email],
        subject,
        template: {
          id: "jobpulse-order-confirmation",
          variables,
        },
      } as any);

      if (error) {
        console.error(
          "Failed to send order confirmation email via Resend:",
          error,
        );
        throw new Error("Failed to send order confirmation email");
      }

      console.log(`Order confirmation email sent to ${email} via Resend`);
    } catch (err) {
      console.error("Unexpected error sending order confirmation email:", err);
      throw new Error("Failed to send order confirmation email");
    }
  } else {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("EMAIL (Development Mode - Not Actually Sent)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(
      `Campaign: ${campaignName} | Total: ${formatCurrency(total)} kr`,
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
};

/**
 * Send invitation email to new user with magic link to set password.
 * Uses the "jobpulse-invitation" template published in the Resend dashboard.
 * Template variables: {{{INVITEE_NAME}}}, {{{COMPANY_NAME}}}, {{{SET_PASSWORD_URL}}}
 */
export const sendInvitationEmail = async (
  email: string,
  firstName: string,
  token: string,
  companyName: string,
): Promise<void> => {
  const setPasswordUrl = `${CLIENT_URL}/set-password?token=${token}`;
  const subject = `You've been invited to join ${companyName} on JobPulse`;

  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [email],
        subject,
        template: {
          id: "account-invitation-1",
          variables: {
            INVITEE_NAME: firstName,
            COMPANY_NAME: companyName,
            SET_PASSWORD_URL: setPasswordUrl,
          },
        },
      } as any);

      if (error) {
        console.error("Failed to send invitation email via Resend:", error);
        throw new Error("Failed to send invitation email");
      }

      console.log(`Invitation email sent to ${email} via Resend`);
    } catch (err) {
      console.error("Unexpected error sending invitation email:", err);
      throw new Error("Failed to send invitation email");
    }
  } else {
    // Development fallback — log instead of sending
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("EMAIL (Development Mode - Not Actually Sent)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`To: ${email}`);
    console.log(`From: ${FROM_NAME} <${FROM_EMAIL}>`);
    console.log(`Subject: ${subject}`);
    console.log("\nSet Password Link:");
    console.log(setPasswordUrl);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
};
