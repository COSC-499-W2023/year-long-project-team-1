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
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import config from "next/config";
import { JSONResponse } from "@lib/response";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { email, feedback } = await req.json();
  console.log("email ", email);
  console.log("feedback ", feedback);

  try {
    const client = new SESClient(config);

    const input = {
      Source: "linhnnk241202@gmail.com",
      Destination: {
        ToAddresses: ["linhnnk241202@gmail.com"],
      },
      Message: {
        Subject: {
          Data: `PrivacyPal: New Feedback from ${email}`,
        },
        Body: {
          Text: {
            Data: `Feedback from ${email}:\n\n${feedback}`,
          },
        },
      },
    };
    const command = new SendEmailCommand(input);
    const response = await client.send(command);
    console.log(response);
    return Response.json({ status: 200 });
  } catch (error) {
    const response: JSONResponse = {
      errors: [
        {
          status: 500,
          meta: error,
        },
      ],
    };
    return NextResponse.json(response, { status: 500 });
  }
};
