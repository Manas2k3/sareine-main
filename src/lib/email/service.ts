import nodemailer from "nodemailer";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  razorpayPaymentId: string;
  items: OrderItem[];
  amount: number;
  shippingAddress: ShippingAddress;
}

function buildOrderEmailHtml(data: OrderEmailData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ece4;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;color:#2a2723;">
          ${item.name}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ece4;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;color:#5e564d;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ece4;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;color:#2a2723;text-align:right;font-weight:600;">
          ₹${item.price * item.quantity}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order Confirmation — Sareine</title>
</head>
<body style="margin:0;padding:0;background-color:#fbf9f4;font-family:'Manrope',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbf9f4;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(201,164,92,0.1);">

          <!-- Gold Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#C9A45C 0%,#D4B46A 50%,#BAA05C 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:28px;font-weight:500;color:#ffffff;letter-spacing:0.06em;">
                SAREINE
              </h1>
              <p style="margin:8px 0 0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:0.1em;text-transform:uppercase;">
                Order Confirmation
              </p>
            </td>
          </tr>

          <!-- Thank You -->
          <tr>
            <td style="padding:32px 24px 16px;">
              <h2 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:22px;font-weight:500;color:#2a2723;">
                Thank you, ${data.customerName}!
              </h2>
              <p style="margin:0;font-size:14px;color:#5e564d;line-height:1.6;">
                Your payment has been confirmed. We are preparing your order with care.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 24px;">
              <hr style="border:none;height:1px;background:linear-gradient(90deg,transparent,#C9A45C,transparent);margin:0;">
            </td>
          </tr>

          <!-- Order Summary Table -->
          <tr>
            <td style="padding:24px;">
              <h3 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:16px;font-weight:500;color:#2a2723;">
                Order Summary
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ece4;border-radius:8px;overflow:hidden;">
                <tr style="background:#faf7f2;">
                  <th style="padding:10px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;text-align:left;">
                    Product
                  </th>
                  <th style="padding:10px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">
                    Qty
                  </th>
                  <th style="padding:10px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;text-align:right;">
                    Price
                  </th>
                </tr>
                ${itemsRows}
                <tr style="background:#faf7f2;">
                  <td colspan="2" style="padding:14px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#2a2723;">
                    Total
                  </td>
                  <td style="padding:14px 16px;font-family:'Georgia',serif;font-size:18px;font-weight:600;color:#2a2723;text-align:right;">
                    ₹${data.amount}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:0 24px 24px;">
              <h3 style="margin:0 0 12px;font-family:'Georgia',serif;font-size:16px;font-weight:500;color:#2a2723;">
                Shipping To
              </h3>
              <div style="background:#faf7f2;border:1px solid #f0ece4;border-radius:8px;padding:16px;">
                <p style="margin:0;font-size:14px;color:#2a2723;line-height:1.7;">
                  <strong>${data.shippingAddress.name}</strong><br>
                  ${data.shippingAddress.street}<br>
                  ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br>
                  📞 ${data.shippingAddress.phone}
                </p>
              </div>
            </td>
          </tr>

          <!-- Payment ID -->
          <tr>
            <td style="padding:0 24px 32px;">
              <p style="margin:0;font-size:12px;color:#5e564d;">
                Payment ID: <strong style="color:#2a2723;">${data.razorpayPaymentId}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#2a2723;padding:24px;text-align:center;">
              <p style="margin:0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.04em;">
                © ${new Date().getFullYear()} Sareine. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// Email service function
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check for required environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      const missingVars = [];
      if (!process.env.GMAIL_USER) missingVars.push('GMAIL_USER');
      if (!process.env.GMAIL_APP_PASSWORD) missingVars.push('GMAIL_APP_PASSWORD');

      const errorMsg = `Missing environment variables: ${missingVars.join(', ')}`;
      console.error('[EMAIL SERVICE ERROR]:', errorMsg);
      return { success: false, error: errorMsg };
    }

    console.log('[EMAIL SERVICE]: Attempting to send email to:', data.customerEmail);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Sareine" <sareinebeauty@gmail.com>',
      to: data.customerEmail,
      subject: "Order Confirmed — Sareine",
      html: buildOrderEmailHtml(data),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[EMAIL SERVICE SUCCESS]: Email sent:", info.response);

    return { success: true };
  } catch (err: any) {
    console.error("[EMAIL SERVICE ERROR]: Failed to send email:", err);
    console.error("[EMAIL SERVICE ERROR]: Error message:", err.message);
    console.error("[EMAIL SERVICE ERROR]: Error stack:", err.stack);
    return { success: false, error: err.message || "Failed to send email" };
  }
}

/* ═══════════════════════════════════════════════
 *  PREORDER CONFIRMATION EMAIL
 * ═══════════════════════════════════════════════ */

interface PreorderEmailData {
  customerName: string;
  customerEmail: string;
  preorderId: string;
  items: OrderItem[];
  amount: number;
  shippingAddress: ShippingAddress;
}

function buildPreorderEmailHtml(data: PreorderEmailData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ece4;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;color:#2a2723;">
          ${item.name}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ece4;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;color:#5e564d;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ece4;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;color:#2a2723;text-align:right;font-weight:600;">
          ₹${item.price * item.quantity}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Pre-order Confirmed — Sareine</title>
</head>
<body style="margin:0;padding:0;background-color:#fbf9f4;font-family:'Manrope',Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbf9f4;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(201,164,92,0.1);">

          <!-- Gold Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#C9A45C 0%,#D4B46A 50%,#BAA05C 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:28px;font-weight:500;color:#ffffff;letter-spacing:0.06em;">
                SAREINE
              </h1>
              <p style="margin:8px 0 0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:0.1em;text-transform:uppercase;">
                Pre-order Confirmed
              </p>
            </td>
          </tr>

          <!-- Thank You -->
          <tr>
            <td style="padding:32px 24px 16px;">
              <h2 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:22px;font-weight:500;color:#2a2723;">
                Thank you, ${data.customerName}!
              </h2>
              <p style="margin:0;font-size:14px;color:#5e564d;line-height:1.6;">
                Your pre-order has been received. We'll begin crafting your order soon and will reach out with a payment link when it's ready to ship.
              </p>
            </td>
          </tr>

          <!-- Pre-order ID -->
          <tr>
            <td style="padding:0 24px 16px;">
              <div style="background:#faf7f2;border:1px solid #f0ece4;border-radius:8px;padding:12px 16px;text-align:center;">
                <p style="margin:0;font-size:11px;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;">Pre-order ID</p>
                <p style="margin:4px 0 0;font-family:'Georgia',serif;font-size:18px;font-weight:600;color:#C9A45C;">${data.preorderId}</p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 24px;">
              <hr style="border:none;height:1px;background:linear-gradient(90deg,transparent,#C9A45C,transparent);margin:0;">
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding:24px;">
              <h3 style="margin:0 0 16px;font-family:'Georgia',serif;font-size:16px;font-weight:500;color:#2a2723;">
                Order Summary
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ece4;border-radius:8px;overflow:hidden;">
                <tr style="background:#faf7f2;">
                  <th style="padding:10px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;text-align:left;">Product</th>
                  <th style="padding:10px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Qty</th>
                  <th style="padding:10px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;text-align:right;">Price</th>
                </tr>
                ${itemsRows}
                <tr style="background:#faf7f2;">
                  <td colspan="2" style="padding:14px 16px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#2a2723;">Total</td>
                  <td style="padding:14px 16px;font-family:'Georgia',serif;font-size:18px;font-weight:600;color:#2a2723;text-align:right;">₹${data.amount}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:0 24px 24px;">
              <h3 style="margin:0 0 12px;font-family:'Georgia',serif;font-size:16px;font-weight:500;color:#2a2723;">Shipping To</h3>
              <div style="background:#faf7f2;border:1px solid #f0ece4;border-radius:8px;padding:16px;">
                <p style="margin:0;font-size:14px;color:#2a2723;line-height:1.7;">
                  <strong>${data.shippingAddress.name}</strong><br>
                  ${data.shippingAddress.street}<br>
                  ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br>
                  📞 ${data.shippingAddress.phone}
                </p>
              </div>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding:0 24px 32px;">
              <div style="background:#fffbeb;border:1px solid #f0ece4;border-radius:8px;padding:16px;">
                <p style="margin:0;font-size:13px;color:#5e564d;line-height:1.6;">
                  💛 <strong>What happens next?</strong><br>
                  We're preparing your order with love. You'll receive a payment link via email once manufacturing is complete (within ~10 days). No payment is needed now.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#2a2723;padding:24px;text-align:center;">
              <p style="margin:0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.04em;">
                © ${new Date().getFullYear()} Sareine. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function sendPreorderConfirmationEmail(
  data: PreorderEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      const missingVars = [];
      if (!process.env.GMAIL_USER) missingVars.push("GMAIL_USER");
      if (!process.env.GMAIL_APP_PASSWORD)
        missingVars.push("GMAIL_APP_PASSWORD");
      const errorMsg = `Missing environment variables: ${missingVars.join(", ")}`;
      console.error("[EMAIL SERVICE ERROR]:", errorMsg);
      return { success: false, error: errorMsg };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Sareine" <sareinebeauty@gmail.com>',
      to: data.customerEmail,
      subject: `Pre-order Confirmed — ${data.preorderId} — Sareine`,
      html: buildPreorderEmailHtml(data),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[EMAIL SERVICE SUCCESS]: Preorder email sent:", info.response);
    return { success: true };
  } catch (err: any) {
    console.error("[EMAIL SERVICE ERROR]: Failed to send preorder email:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}

/* ═══════════════════════════════════════════════
 *  PAYMENT LINK EMAIL
 * ═══════════════════════════════════════════════ */

interface PaymentLinkEmailData {
  customerName: string;
  customerEmail: string;
  preorderId: string;
  amount: number;
  paymentLink: string;
}

function buildPaymentLinkEmailHtml(data: PaymentLinkEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Complete Your Payment — Sareine</title>
</head>
<body style="margin:0;padding:0;background-color:#fbf9f4;font-family:'Manrope',Helvetica,Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbf9f4;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(201,164,92,0.1);">

          <!-- Gold Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#C9A45C 0%,#D4B46A 50%,#BAA05C 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:28px;font-weight:500;color:#ffffff;letter-spacing:0.06em;">
                SAREINE
              </h1>
              <p style="margin:8px 0 0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:0.1em;text-transform:uppercase;">
                Your Order is Ready
              </p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:32px 24px 16px;">
              <h2 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:22px;font-weight:500;color:#2a2723;">
                Hi ${data.customerName},
              </h2>
              <p style="margin:0;font-size:14px;color:#5e564d;line-height:1.6;">
                Great news! Your pre-order <strong style="color:#C9A45C;">${data.preorderId}</strong> is ready. Please complete your payment to proceed with shipping.
              </p>
            </td>
          </tr>

          <!-- Amount -->
          <tr>
            <td style="padding:0 24px 24px;">
              <div style="background:#faf7f2;border:1px solid #f0ece4;border-radius:8px;padding:20px;text-align:center;">
                <p style="margin:0;font-size:11px;color:#5e564d;text-transform:uppercase;letter-spacing:0.08em;">Amount Due</p>
                <p style="margin:8px 0 0;font-family:'Georgia',serif;font-size:32px;font-weight:600;color:#2a2723;">₹${data.amount}</p>
              </div>
            </td>
          </tr>

          <!-- Pay Button -->
          <tr>
            <td style="padding:0 24px 32px;text-align:center;">
              <a href="${data.paymentLink}" style="display:inline-block;background:linear-gradient(135deg,#C9A45C 0%,#D4B46A 50%,#BAA05C 100%);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:8px;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;letter-spacing:0.04em;">
                Pay Now
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#5e564d;">
                Or copy this link: <a href="${data.paymentLink}" style="color:#C9A45C;">${data.paymentLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#2a2723;padding:24px;text-align:center;">
              <p style="margin:0;font-family:'Manrope',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.04em;">
                © ${new Date().getFullYear()} Sareine. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function sendPaymentLinkEmail(
  data: PaymentLinkEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      const missingVars = [];
      if (!process.env.GMAIL_USER) missingVars.push("GMAIL_USER");
      if (!process.env.GMAIL_APP_PASSWORD)
        missingVars.push("GMAIL_APP_PASSWORD");
      const errorMsg = `Missing environment variables: ${missingVars.join(", ")}`;
      console.error("[EMAIL SERVICE ERROR]:", errorMsg);
      return { success: false, error: errorMsg };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Sareine" <sareinebeauty@gmail.com>',
      to: data.customerEmail,
      subject: `Complete Your Payment — ${data.preorderId} — Sareine`,
      html: buildPaymentLinkEmailHtml(data),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "[EMAIL SERVICE SUCCESS]: Payment link email sent:",
      info.response
    );
    return { success: true };
  } catch (err: any) {
    console.error(
      "[EMAIL SERVICE ERROR]: Failed to send payment link email:",
      err
    );
    return { success: false, error: err.message || "Failed to send email" };
  }
}
