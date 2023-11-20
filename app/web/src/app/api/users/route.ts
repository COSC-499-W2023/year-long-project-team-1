import db from "@lib/db"
import { NextRequest, NextResponse } from "next/server"


// GET api/users?ids=id1,id2
/*
  The user list returned is filtered based on ids. 
  If id param is not provided, the api will return all users.
*/
const userQuery = (ids?: number[]) => db.user.findMany({
  where: {id: {in: ids || undefined}}
})

async function getUsrData(ids?: number[]) {
  let data = await userQuery(ids)
  return {status: 200, result: {data}} as const
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
    return NextResponse.json(result)   
  }catch(e){
    return NextResponse.json({status: 400, message: e})
  }
}

function paramToIntList(param: string){
    let stringVals =  param.split(",")
    return stringVals.map(v => Number(v))
}

