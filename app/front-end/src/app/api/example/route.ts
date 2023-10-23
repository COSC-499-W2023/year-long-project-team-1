/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

export const add = (a: number, b: number) => a + b;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const a = Number(searchParams.get("a"));
    const b = Number(searchParams.get("b"));

    if (!a || !b) return new Response("Missing a or b", { status: 400 });

    const sum = add(a, b);
    return new Response(`Calculated ${a} + ${b} = ${sum}`, { status: 200 });
}
