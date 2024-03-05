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

import { getClients, getLoggedInUser } from "@app/actions";
import { addUserToGroup, createUser, getUsrList } from "@lib/cognito";
import {
  JSONErrorBuilder,
  JSONResponse,
  JSONResponseBuilder,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_NOT_FOUND,
} from "@lib/response";
import { UserRole } from "@lib/userRole";
import { resolveNs } from "dns";
import { NextRequest } from "next/server";

interface RequestBody {
  username: string;
  email: string;
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queriedUsr = searchParams.get("username");

  let clients;
  if (queriedUsr) {
    //search specific user
    clients = await getUsrList("username", queriedUsr);
  } else {
    // search all clients
    clients = await getClients();
  }
  if (clients && clients.length > 0) {
    const res: JSONResponse = {
      data: clients,
    };
    return Response.json(res, { status: 200 });
  }

  return Response.json(RESPONSE_NOT_FOUND, { status: 404 });
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();

  // TODO: Consider removing this code and implement the check in middleware
  const loggedinUser = await getLoggedInUser();

  if (loggedinUser?.role !== UserRole.PROFESSIONAL) {
    // only allow professional to add new user
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  const { username, email } = body;
  if (!username || !email) {
    return Response.json(
      JSONResponseBuilder.from(
        400,
        JSONErrorBuilder.from(400, "Missing username or email"),
      ),
      { status: 400 },
    );
  }

  // Create new user to user pool
  try {
    await createUser({ username: username, email: email });
    await addUserToGroup({ username: username, groupName: UserRole.CLIENT });
  } catch {
    return Response.json(
      JSONResponseBuilder.from(
        500,
        JSONErrorBuilder.from(500, "Internal server error"),
      ),
      { status: 500 },
    );
  }

  return Response.json(
    {
      data: { message: "User successfully added to user pool" },
    },
    { status: 200 },
  );
}
