import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import {
    JSONError,
    JSONErrorBuilder,
    JSONResponseBuilder,
    RESPONSE_NOT_AUTHORIZED,
  } from "@lib/response";
  import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.statusCode = 405; // Set status code
    return res.end(); // Return 405 Method Not Allowed
  }
//   const body: RequestBody = await req.json();

  const { email, feedback } = req.body;
  const ses = new AWS.SES();

  // Send email to admin
  const adminParams = {
    Destination: {
      ToAddresses: ['linhnnk241202@gmail.com'], // Admin's email address
    },
    Message: {
      Body: {
        Text: {
          Data: `Feedback from ${email}:\n\n${feedback}`,
        },
      },
      Subject: {
        Data: `PrivacyPal: New Feedback from ${email}`,
      },
    },
    Source: 'linhnnk241202@gmail.com', // Sender's email address (admin)
  };

  try {
    await ses.sendEmail(adminParams).promise();
    res.statusCode = 200; // Set status code
   res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify({ message: 'Feedback submitted successfully' }));
  }catch{
    // console.error('Error sending email:', error);
    res.statusCode = 400; // Set status code
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Feedback failed' }));
  };
};
