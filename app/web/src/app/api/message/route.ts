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
import { getLoggedInUser } from "@app/actions";
import prisma from "@lib/db";
import {
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_OK,
} from "@lib/response";
import { NextRequest } from "next/server";

interface RequestBody {
  message: string;
  apptId: number;
}
export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { apptId, message } = body;

  const user = await getLoggedInUser();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // check if user has appointment of apptId
  const appointment = await prisma.appointment.count({
    where: {
      id: apptId,
      OR: [
        {
          clientUsrName: user.username,
        },
        {
          proUsrName: user.username,
        },
      ],
    },
  });

  if (appointment == 0) {
    return Response.json(
      { message: "Appointment not found." },
      { status: 404 },
    );
  }

  try {
    await prisma.message.create({
      data: {
        message: message,
        time: new Date(),
        apptId: apptId,
      },
    });
    return Response.json(
      {
        message: RESPONSE_OK,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return Response.json(
      {
        message: RESPONSE_INTERNAL_SERVER_ERROR,
      },
      { status: 500 },
    );
  }
}
