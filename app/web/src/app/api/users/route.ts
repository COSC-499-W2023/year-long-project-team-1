import db from "@lib/db"
import { JsonObject } from "@prisma/client/runtime/library"
import { NextRequest, NextResponse } from "next/server"


// GET api/users?ids=id1,id2
/*
  The user list returned is filtered based on ids. 
  If id param is not provided, the api will return all users.
*/
const getusrDatQuery = (ids?: number[]) => db.user.findMany({
  where: {id: {in: ids || undefined}}
})

async function getUsrData(ids?: number[]) {
  let data = await getusrDatQuery(ids)
  return {result: {data}} as const
}

export async function GET(req: NextRequest){
  const searchParams = req.nextUrl.searchParams
  const param = searchParams.get('id')
  let usrIds: number[] | undefined = undefined
  if (param !== null) {
    usrIds = paramToIntList(param!)
  }
  try{
    let result = await getUsrData(usrIds);
    return NextResponse.json(result,{status: 200})   
  }catch(e){
    return NextResponse.json({message: e}, {status: 400})
  }
}

function paramToIntList(param: string){
    let stringVals =  param.split(",")
    return stringVals.map(v => Number(v))
}

// PUT api/users?id=1
// UserId is required in parameters
const updateUsrDatQuery = (id: number, data: JsonObject) => db.user.update({
  where:{
    id: id
  },
  data: data
})
export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const param = searchParams.get('id')
  if (param === null) {
    return NextResponse.json({message: "Missing user id"}, {status: 400});
  }
  try{
    const data = await req.json()
    let result = await updateUsrDatQuery(Number(param), data);
    return NextResponse.json(result, {status: 200})   
  }catch(e){
    return NextResponse.json({message: e}, {status: 400})
  }
}
