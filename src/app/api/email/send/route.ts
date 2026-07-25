import { NextResponse } from "next/server";
import { sendActionItemEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, recipientName, actionItemDescription, deadline, meetingTitle } = body;

    if (!to || !actionItemDescription) {
      return NextResponse.json(
        { error: "Missing required parameters (to, actionItemDescription)" },
        { status: 400 }
      );
    }

    const result = await sendActionItemEmail({
      to,
      recipientName: recipientName || "Team Member",
      actionItemDescription,
      deadline: deadline || "ASAP",
      meetingTitle,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to dispatch email via Resend" },
      { status: 500 }
    );
  }
}
