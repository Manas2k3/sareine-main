import { Resend } from "resend";

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
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Sareine <onboarding@resend.dev>",
      to: [data.customerEmail],
      subject: `Order Confirmed — Sareine`,
      html: buildOrderEmailHtml(data),
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email service error:", err);
    return { success: false, error: "Failed to send email" };
  }
}
