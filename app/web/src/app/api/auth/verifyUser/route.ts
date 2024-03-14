import { respondToAuthChallenge } from "@lib/cognito";
import {
  JSONErrorBuilder,
  JSONResponseBuilder,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
} from "@lib/response";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

interface RequestBody {
  username: string;
  firstName: string;
  lastName: string;
  newPassword: string;
  phoneNumber: string;
}
export async function POST(req: NextRequestWithAuth) {
  const body: RequestBody = await req.json();
  const authToken = (await getToken({req}))!;

  if(!authToken.changePassChallenge){
    return Response.json(
      JSONResponseBuilder.from(
        404,
        JSONErrorBuilder.from(404, "Change password challenge not found."),
      ),
      { status: 404 },
    );
  }
  
  const authUsername = authToken.changePassChallenge.userIdForSRP;
  const session = authToken.changePassChallenge.session;
  if (authUsername != body.username) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }
  try {
    await respondToAuthChallenge({
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      newPassword: body.newPassword,
      phoneNumber: body.phoneNumber,
    }, session);
  } catch (e) {
    console.log(e);
    Response.json(RESPONSE_INTERNAL_SERVER_ERROR, { status: 500 });
  }

  return Response.json(
    {
        data: { message: "Password is successfully updated!" },
    },
    { status: 200 },
);
}
