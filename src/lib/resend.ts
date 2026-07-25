import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "re_mock_key_for_dev";

export const resend = new Resend(resendApiKey);

export interface ActionItemEmailParams {
  to: string;
  recipientName: string;
  actionItemDescription: string;
  deadline: string;
  meetingTitle?: string;
}

export async function sendActionItemEmail({
  to,
  recipientName,
  actionItemDescription,
  deadline,
  meetingTitle = "Iteris OS Strategy Sync",
}: ActionItemEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Resend Mock Email Dispatch] To: ${to} | Task: ${actionItemDescription} | Due: ${deadline}`);
    return { success: true, id: `mock-email-${Date.now()}` };
  }

  try {
    const data = await resend.emails.send({
      from: "Iteris OS <onboarding@resend.dev>",
      to,
      subject: `[Action Item Assigned] ${actionItemDescription.slice(0, 50)}...`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; background-color: #0A0D10; color: #E7ECEF; padding: 32px; border-radius: 16px;">
          <h2 style="color: #5EE0FF; margin-top: 0;">Iteris OS — Task Follow-up</h2>
          <p>Hi <strong>${recipientName}</strong>,</p>
          <p>An action item has been assigned to you from the meeting <strong>${meetingTitle}</strong>:</p>
          <div style="background: #12161B; border-left: 3px solid #5EE0FF; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px;"><strong>${actionItemDescription}</strong></p>
            <p style="margin: 8px 0 0 0; color: #8791A0; font-size: 13px;">Deadline: ${deadline}</p>
          </div>
          <p style="color: #8791A0; font-size: 12px;">Dispatched automatically by Iteris OS Meeting Agent.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Resend Email Error:", error);
    return { success: false, error: error.message };
  }
}
