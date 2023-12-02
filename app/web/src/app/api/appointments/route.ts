import db from "@lib/db";
import { getLoggedInUser } from "@app/actions";
import { JSONResponse } from "@lib/json";
import { NextRequest, NextResponse } from "next/server";

const getApptsByUserId = (userId: number, isPro: boolean) => {
	if (isPro)
		return db.appointment.findMany({
			where: {
				proId: {
					equals: userId,
				},
			},
			select: {
				time: true,
				proId: true,
				Video: true,
			},
		});
	return db.appointment.findMany({
		where: {
			clientId: {
				equals: userId,
			},
		},
		select: {
			time: true,
			clientId: true,
			Video: true,
		},
	});
};

const getApptById = (apptId: number, isPro: boolean) => {
	if (isPro)
		return db.appointment.findFirst({
			where: {
				id: {
					equals: apptId,
				},
			},
			select: {
				time: true,
				proId: true,
				Video: true,
			},
		});
	return db.appointment.findFirst({
		where: {
			id: {
				equals: apptId,
			},
		},
		select: {
			time: true,
			clientId: true,
			Video: true,
		},
	});
};

// GET /api/appointments?id=1 returns a JSON object of the specified appointment
// GET /api/appointments returns a JSON object of the appointments the logged in user is in
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const apptIdString = searchParams.get("id");
	const user = await getLoggedInUser();

	if (user === null) {
		const response: JSONResponse = {
			errors: [
				{
					status: "401",
					title: "User not logged in.",
				},
			],
		};
		return NextResponse.json(response, { status: 401 });
	}

	let proUser = user?.role == "PROFESSIONAL";

	if (apptIdString === null) {
		// no id provided, so use user session to get appointments
		let appts = await getApptsByUserId(user?.id, proUser);
		if (appts.length == 0) {
			const response: JSONResponse = {
				errors: [
					{
						status: "404",
						title: "Error: user is in no appointments.",
					},
				],
			};
			return NextResponse.json(response, { status: 404 });
		}
		const response: JSONResponse = { data: { appointments: appts } };
		return NextResponse.json(response, { status: 200 });
	} else {
		// search by apptId
		let apptId = Number(apptIdString);
		let appt = await getApptById(apptId, proUser);
		if (appt == undefined) {
			const response: JSONResponse = {
				errors: [
					{
						status: "404",
						title: "Error: appointment with the id specified doesn't exist",
					},
				],
			};
			return NextResponse.json(response, { status: 404 });
		}
		const response: JSONResponse = { data: { appt } };
		return NextResponse.json(response, { status: 200 });
	}
}

// POST /api/appointments with some JSON data returns success or fail message for creating the appointment
export async function POST(req: NextRequest) {
	const apptData = await req.json();
	let fullInfo = true;
	["time", "proId", "clientId"].forEach((i) => {
		if (apptData[i] == undefined) fullInfo = false;
	});
	if (!fullInfo) {
		const response: JSONResponse = {
			errors: [
				{
					status: "400",
					title: "Not enough information provided, need time, proId, and userId to create appointment",
				},
			],
		};
		return NextResponse.json(response, { status: 400 });
	}
	try {
		await db.appointment.create({
			data: apptData,
		});
		const response: JSONResponse = {
			data: { message: "Successfully created new appointment." },
		};
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		const response: JSONResponse = {
			errors: [
				{
					status: "500",
					meta: error,
				},
			],
		};
		return NextResponse.json(response, { status: 500 });
	}
}

// PUT /api/appointments with some JSON data returns success or fail message for updating the appointment
export async function PUT(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const apptData = await req.json();
	const apptIdString = searchParams.get("id");
	if (apptIdString === null) {
		const response: JSONResponse = {
			errors: [
				{
					status: "400",
					title: "No id parameter to specify which appointment to update",
				},
			],
		};
		return NextResponse.json(response, { status: 400 });
	}
	let apptId = Number(apptIdString);
	try {
		await db.appointment.update({
			where: {
				id: apptId,
			},
			data: apptData,
		});
		const response: JSONResponse = {
			data: { message: "Successfully updated appointment info." },
		};
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		const response: JSONResponse = {
			errors: [
				{
					status: "500",
					meta: error,
				},
			],
		};
		return NextResponse.json(response, { status: 500 });
	}
}
