# API routes

How to make an API route:

Create a folder with the name of the url slug you want to use:

i.e. `localhost:3000/api/my-route` => `/src/app/api/my-route`

Then inside this folder, create a file called `route.ts` that exports a default `async` function.

```ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(200).json({ message: "Hello World!" });
}
```
