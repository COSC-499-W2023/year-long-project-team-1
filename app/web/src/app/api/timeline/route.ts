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
  JSONResponse,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
} from "@lib/response";
import { VideoURL, getPostedVideoURLs } from "@lib/utils";
import { NextRequest, NextResponse } from "next/server";

type Message = {
  message: string;
  time: Date;
};

type Event = Message | VideoURL;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const apptIdFromReq = searchParams.get("apptId");

  const user = await getLoggedInUser();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  if (!apptIdFromReq) {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "Missing apptId.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
  }

  let apptId: number;
  try {
    apptId = parseInt(apptIdFromReq);
  } catch {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "apptId must be of type number.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
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
    let events: Event[] = [];

    const urls = await getPostedVideoURLs(apptId);

    if (urls) {
      events.push(...urls);
    }
    const messages: Message[] = await prisma.message.findMany({
      orderBy: [
        {
          time: "desc",
        },
      ],
      where: {
        apptId: apptId,
      },
      select: {
        id: true,
        time: true,
        message: true,
        sender: true,
      },
    });

    if (messages) {
      events.push(...messages);
    }

    events.sort((a, b) => (a.time >= b.time ? -1 : 1));

    return NextResponse.json(
      {
        data: events,
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
