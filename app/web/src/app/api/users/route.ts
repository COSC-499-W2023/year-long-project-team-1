import db from "@lib/db"
import { JSONResponse } from "@lib/json";

const userQuery = () => db.user.findMany()
async function getUsersData(){
  let users = await userQuery();
  return users;
}

export async function POST(req: Request) {
  await db.user.createMany({
    data: [
      {
          // mock data
          username: "johhn",
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@gmail.com",
          role: "CLIENT",
          password: "password"
      }
  ]
  });
  const res: JSONResponse = { data: { success: true } };
  return Response.json(res);
}

export type UsersDataResponse = {
  status: number,
  result: {
    data: any
  }
}

export async function GET(req: Request){
  let users = await getUsersData();
  const res: JSONResponse = {data: users}
  return Response.json({
    status: 200,
    result: res
  } as UsersDataResponse);
}
