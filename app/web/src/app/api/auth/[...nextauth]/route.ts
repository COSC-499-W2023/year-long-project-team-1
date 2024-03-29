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
import NextAuth from "next-auth";
import { RouteHandler } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { cognitoConfig } from "src/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// `res` is supposedly of type RouteHandlerContext but no module we have exports
// a type like that so i'm just leaving it like this
const handler = async (req: NextRequest, res: any) => {
  return NextAuth(req, res, cognitoConfig(req));
};

export { handler as GET, handler as POST };
