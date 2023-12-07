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
import db from "@lib/db";
import { JsonObject } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import {
  JSONErrorBuilder,
  JSONResponseBuilder,
} from "@lib/response";

// GET api/users?ids=id1,id2
/*
  The user list returned is filtered based on ids. 
  If id param is not provided, the api will return all users.
*/
const getusrDatQuery = (ids?: number[]) =>
  db.user.findMany({
    where: {
      id: {
        in: ids || undefined,
      },
    },
    // to filter out password field, prisma still working on a better way for this
    // https://github.com/prisma/prisma/issues/5042
    select: {
      email: true,
      firstname: true,
      lastname: true,
      username: true,
      role: true,
    },
  });

async function getUsrData(ids?: number[]) {
  let data = await getusrDatQuery(ids);
  return { result: { data } } as const;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const param = searchParams.get("id");
  let usrIds: number[] | undefined = undefined;
  if (param !== null) {
    usrIds = paramToIntList(param!);
    // verify list doesn't contain NaN values
    let inValidIds: boolean = usrIds.some(id => isNaN(id));
    if(inValidIds){
      return Response.json(JSONResponseBuilder.from(
        400,
        JSONErrorBuilder.from(
          400,
          "Invalid parameters",
          "id must be a list of string numbers or single string number.",
        ),
      ),{status: 400});
    }
  }
  try {
    let result = await getUsrData(usrIds);
    return Response.json(result, { status: 200 });
  } catch (e: any) {
    return Response.json(JSONResponseBuilder.from(
      500,
      JSONErrorBuilder.from(
        500,
        "Failure while processing request",
        e.message || e,
      ),
    ), { status: 500 });
  }
}

function paramToIntList(param: string) {
  let stringVals = param.split(",");
  return stringVals.map((v) => Number(v));
}

// PUT api/users?id=1
// UserId is required in parameters
const updateUsrDatQuery = (id: number, data: JsonObject) =>
  db.user.update({
    where: {
      id: id,
    },
    data: data,
  });
export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const param = searchParams.get("id");
  if (param === null) {
    return Response.json(JSONResponseBuilder.from(
      400,
      JSONErrorBuilder.from(
        400,
        "Invalid parameters",
        "Missing user id.",
      ),
    ), { status: 400 });
  }
  try {
    const data = await req.json();
    let result = await updateUsrDatQuery(Number(param), data);
    return Response.json(result, { status: 200 });
  } catch (e: any) {
    return Response.json(JSONResponseBuilder.from(
      500,
      JSONErrorBuilder.from(
        500,
        "Failure while processing request",
        e.message || e,
      ),
    ), { status: 500 });
  }
}
