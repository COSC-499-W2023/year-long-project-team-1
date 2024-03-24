import { NextApiRequest, NextApiResponse } from 'next';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"; 
import config from 'next/config';
import { JSONResponse } from '@lib/response';
import { NextRequest, NextResponse } from 'next/server';


export const POST = async (req: NextRequest) => {

  const { email, feedback } = await req.json();
  console.log("email ", email);
  console.log("feedback ", feedback);

  try{
    const client = new SESClient(config);
    
    const input = { 
      Source: "linhnnk241202@gmail.com", 
      Destination: {
        ToAddresses: [ 
        "linhnnk241202@gmail.com",

        ],
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
    return Response.json(
      { status: 200 },
    );
  }catch(error){
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
