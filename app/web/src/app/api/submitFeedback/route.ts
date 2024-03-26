/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { JSONResponse } from "@lib/response";
import { NextRequest, NextResponse } from "next/server";
import { sendFeedbackEmail } from "@lib/ses";

export const POST = async (req: NextRequest) => {
  const { email, feedback } = await req.json();
  const noreplyEmail = process.env.NOREPLY_EMAIL;

  if (!noreplyEmail) {
    return Response.json({
      status: 400,
      message: "Sender email is not defined.",
    });
  }

  try {
    await sendFeedbackEmail(noreplyEmail, email, feedback);
    return Response.json({ status: 200, message: "Email sent successfully." });
  } catch (error) {
    return Response.json({ status: 500, message: "Failed to send email." });
  }
};
