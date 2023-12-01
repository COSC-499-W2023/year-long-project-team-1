import { getLoggedInUser } from "@app/actions";
import db from "@lib/db";
import { NextRequest, NextResponse } from "next/server";

const isProUser = async () => {
    let user = await getLoggedInUser();
    return user?.role == "PROFESSIONAL";
}

// GET /api/appointments?id=1 returns a JSON object of the specified appointment
// GET /api/appointments?userId=1 returns a JSON object of the appointments that user is in
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const apptIdString = searchParams.get("id");
    const userIdString = searchParams.get("userId");
    const proUser = await isProUser();
    if (apptIdString === null && userIdString === null)
        return NextResponse.json({message: "No id parameters (id or userId) in GET request."}, {status: 400});
    else if (apptIdString === null) {    // search by userId
        let userId = Number(userIdString);
        let appts;
        if (proUser) {
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
                proId: proUser,
                clientId: !proUser,
                Video: true
            }
        });
        if (appt == undefined)
            return NextResponse.json({message: "Error: appointment with the id specified doesn't exist"}, {status: 404});
        return NextResponse.json(appt, {status: 200});
    }
}

// POST /api/appointments with some JSON data returns success or fail message for creating the appointment
export async function POST(req: NextRequest) {
    const apptData = await req.json();
    let fullInfo = true;
    ["time", "proId", "clientId"].forEach((i) => {
        if (apptData[i] == undefined)
            fullInfo = false;
    });
    if (!fullInfo)
        return NextResponse.json({message: "Not enough information provided, need time, proId, and userId to create appointment"}, {status: 400});
    try {
        await db.appointment.create({
            data: apptData
        });
        return NextResponse.json({message: "Successfully created new appointment."}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error}, {status: 400});
    }
}

// PUT /api/appointments with some JSON data returns success or fail message for updating the appointment
export async function PUT(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const apptData = await req.json();
    const apptIdString = searchParams.get("id");
    if (apptIdString === null)
        return NextResponse.json({message: "No id parameter to specify which appointment to update"}, {status: 400});
    let apptId = Number(apptIdString);
    try {
        await db.appointment.update({
            where: {
                id: apptId
            },
            data: apptData
        });
        return NextResponse.json({message: "Successfully updated appointment info."}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error}, {status: 400});
    }
}
