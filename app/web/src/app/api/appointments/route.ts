import db from "@lib/db";
import { TruckMonsterIcon } from "@patternfly/react-icons";
import { JsonObject } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

const isProUser = () => {
    // TODO: actually fix this to be accurate depending on the logged in user
    return false;
}

// GET /api/appointments?id=1 returns a JSON object of the specified appointment
// GET /api/appointments?userId=1 returns a JSON object of the appointments that user is in
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const apptIdString = searchParams.get("id");
    const userIdString = searchParams.get("userId");
    if (apptIdString === null && userIdString === null)
        return NextResponse.json({message: "No id parameters (id or userId) in GET request."}, {status: 400});
    else if (apptIdString === null) {    // search by userId
        let userId = Number(userIdString);
        let appts;
        if (isProUser()) {
            appts = await db.appointment.findMany({
                where: {
                    proId: {
                        equals: userId
                    }
                },
                select: {
                    time: true,
                    proId: true,
                    clientId: false,
                    Video: true
                }
            });
        }
        else {
            appts = await db.appointment.findMany({
                where: {
                    clientId: {
                        equals: userId
                    }
                },
                select: {
                    time: true,
                    proId: false,
                    clientId: true,
                    Video: true
                }
            });
        }
        if (appts.length == 0)
            return NextResponse.json({message: "Error: userId provided is in no appointments."}, {status: 404});
        return NextResponse.json({appointments: appts}, {status: 200});
    }
    else {  // search by apptId
        let apptId = Number(apptIdString);
        let appt = await db.appointment.findFirst({
            where: {
                id: {
                    equals: apptId
                }
            },
            select: {
                time: true,
                proId: isProUser(),
                clientId: !isProUser(),
                Video: true
            }
        });
        if (appt == undefined)
            return NextResponse.json({message: "Error: appointment with the id specified doesn't exist"}, {status: 404});
        return NextResponse.json(appt, {status: 200});
    }
}


export async function POST(req: NextRequest) {
    
}
