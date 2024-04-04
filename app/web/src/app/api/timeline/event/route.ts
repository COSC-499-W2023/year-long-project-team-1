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
  TimelineItemKey,
  deleteTimelineItem,
  getLoggedInUser,
} from "@app/actions";
import {
  RESPONSE_BAD_REQUEST,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_OK,
} from "@lib/response";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  // extract messageId or awsRef from request
  const searchParams = req.nextUrl.searchParams;
  const messageIdString = searchParams.get("messageId");
  const awsRef = searchParams.get("awsRef");
  const apptId: number = parseInt(searchParams.get("appt") ?? "-1");

  const user = await getLoggedInUser();
  const username = user?.username;

  if (!user || !username) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  if (!messageIdString && !awsRef) {
    console.error("Missing messageId or awsRef in request.");
    return Response.json(RESPONSE_BAD_REQUEST, { status: 400 });
  }

  const messageId = parseInt(messageIdString ?? "-1");
  if (!awsRef && (isNaN(messageId) || messageId < 0)) {
    console.error("Invalid messageId in request.");
    return Response.json(RESPONSE_BAD_REQUEST, { status: 400 });
  }

  if (isNaN(apptId) || apptId < 0) {
    console.error("Invalid apptId in request.");
    return Response.json(RESPONSE_BAD_REQUEST, { status: 400 });
  }

  // delete message or video
  let itemKey: TimelineItemKey;
  if (awsRef) {
    itemKey = { type: "awsRef", awsRef, apptId };
  } else {
    itemKey = { type: "messageId", messageId, apptId };
  }

  try {
    await deleteTimelineItem(itemKey);
  } catch (error: any) {
    console.error("Failed to delete timeline item.", error);
    return Response.json(RESPONSE_INTERNAL_SERVER_ERROR, { status: 500 });
  }

  revalidatePath("/api/timeline");
  revalidatePath("/user/appointments");
  return Response.json(RESPONSE_OK, { status: 200 });
}
