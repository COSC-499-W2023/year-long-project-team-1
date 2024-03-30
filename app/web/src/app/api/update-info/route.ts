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

import {
  JSONResponse,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_OK,
} from "@lib/response";
import { getLoggedInUser } from "@app/actions";
import { updateUserAttributes } from "@lib/cognito";

export async function POST(req: Request) {
  // retrieve user id
  const user = await getLoggedInUser();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // read the form data
  const data = await req.formData();
  const attributeString: string = data.get("userAttributes") as string;
  if (!attributeString) {
    return Response.json("No attributes specified.", { status: 400 });
  }

  try {
    const attributes = JSON.parse(attributeString);
    const response = await updateUserAttributes(user, attributes);

    if (response.$metadata.httpStatusCode === 200)
      return Response.json(RESPONSE_OK, { status: 200 });
    else
      return Response.json("AWS Cognito error.", {
        status: response.$metadata.httpStatusCode,
      });
  } catch (error: any) {
    console.log("ERROR in /api/update-info: ", error);
    return Response.json(RESPONSE_INTERNAL_SERVER_ERROR, { status: 500 });
  }
}
