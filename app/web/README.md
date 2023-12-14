# PrivacyPal

Created with Next.js 13 featuring TypeScript, and the `./src/` folder structure.

## REQUIREMENTS

### Build requirements

- [Node.js](https://nodejs.org/en) v18+
- npm v9.8.1+ (Installed with Node)
- [Podman](https://podman.io/docs/installation) 4.7+

### Run requirements

- [Make](https://www.gnu.org/software/make/) 4+

## BUILD

### Set up dependencies

Install node modules:

```bash
cd app/web
npm ci
```

### Local build

This builds the Next.js app locally into `./.next`. Pages are compiled and elements are served statically where applicable.

```bash
npm run build
```

### Container image build

This builds the Next.js app into a container image and publish to the local image registry.

```bash
npm run oci:build # Or make oci-build
```

## RUN

### Run locally with dev mode

This will start a development server at `http://localhost:8081` (Default to port `8081`). To set a different port, use `PORT` environment variable.

```bash
PORT=8081 npm run start:dev
```

### Run locally with podman

This will start a production server in a container at `http://localhost:8080` (Default to port `8080`). To set a different port, use `PORT` environment variable.

```bash
PORT=8080 npm run oci:start # Or make run
```

## FILE STRUCTURE

Next.js has rules about file structure. I will briefly explain them here.

### Pages

Pages are located in `./src/app/`. A "page" is created when a folder containing a `page.tsx` and (optionally) a `layout.tsx` file is created.

The route's name is the name of the folder. For example, `./src/app/my-page/page.tsx` will be accessible at `http://localhost:3000/my-page`.

The `page.tsx` file defines the content of that page.

The `layout.tsx` file is used to create common page structure for routes and subroutes. This allows us to declare aspects of the page like `<title>`, `<meta>`, and other elements that usually exist in the `<head>` tag, as well as elements common to a group of pages like navigation or footers. However, some metadata, like the title, is stored in the exported member `metadata`. Check out `./src/app/layout.tsx` to get a sense of how this works.

If a `layout.tsx` is not declared in the route's folder, the nearest parent folder's layout is used.

Every page must still declare a `page.tsx`. Some of this code runs on the back end, some on the front end. Next.js 13 defaults to server-side components, where all their code must run server-side. It will produce an error if you try to use DOM properties like `window` or `document` in a scope outside of `useEffect()` or in a server-side component.

Pages are React function components and I generally define them using `function()` syntax using the name of the page as the function's name.

For example, `/my-page`:

```tsx
export default function MyPage() {
  return <div>Hello World!</div>;
}
```

The `./src/app/` folder must always contain both.

### Components

Components are reusable React objects that can be imported into pages. They are located in `./src/app/components/`. These files should contain either a single component or a group of related components. i.e. `./src/app/components/MyInput.tsx` which exports one or more "input" related elements, or instead `./src/app/components/input/MyInput.tsx`, `./src/app/components/input/MyButton.tsx`, etc.

I generally follow the practice of subfolders for related components, and then files that export subclass-style versions of those components. That is to say the file `MyButton.tsx` will export a `Button` component and something like a `DeleteButton` that encapsulates `Button`.

For example:

```tsx
export const MyButton = ({ className, label, onClick }: ButtonProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button className={className} onClick={handleClick}>
      {label}
    </button>
  );
};

export const MyDeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <MyButton className="btn-delete btn-red" label="Delete" onClick={onClick} />
  );
};
```

I generally define components using arrow syntax: `const MyComponent = () => {}`.

Also, I don't know if there is a standard but I name my component files with title case, like Java classes, to make them distinctive (e.g. `MyComponent.tsx`) and to match the React component naming convention.

### API Routes

API routes are located in `./src/app/api/`. The follow a similar naming convention to pages except they use `route.ts` (not `.tsx`) to define the route's behavior. This code is also entirely back end so it cannot use React components or DOM properties, but it does have things like filesystem access and can use Node.js modules.

This file must export a default `async` member called (anything but the convention is) `handler()`, which takes 2 arguments: `req` and `res`. These are the Next.js `NextApiRequest` and `NextApiResponse` objects. You can use these to get the request's body, headers, cookies, etc. and to send a response. If you've ever used `express-js` before, these feel much the same.

For example, `/api/my-route` => `/src/app/api/my-route/route.ts`:

```ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(200).json({ message: "Hello World!" });
}
```

### Static and Public Files

The only files that users can typically access from the web are the routes within `./src/app/` and `./src/app/api`. Files within this routes are not accessible to users.

To serve images, fonts, or downloadable files we must place them in the `./public` folder. These _are_ accessible to users from the web.

To have common scripts across pages and components, we must place them in the `./src/lib` folder. This is for custom scripts that are not React components or API routes. For example, string manipulation, date formatting, etc. This makes a good place for things like database abstraction code, such as a class and its subclasses that are used to query a database. These _are not_ accessible to users from the web.

### Authentication

Ensure you have run the script at `./generate_dev_env.sh` to create necessary environment variables. You will also have to run the database preparation scripts. See [`./db/README.md`](./db/README.md).

```bash
bash ./generate_dev_env.sh
```

To opt a page (and all its subpages) into authentication, go to `./src/middleware.ts` and add the page's slug (i.e. `/mypage`) to the protected paths array:

```ts
// possible protected paths
const protectedPathSlugs = ["/user", "/staff", "/api"];
```

From a route that requires authentication, there are several ways to collect the user's credentials.

> **Note:** you can also use these to see if the user is logged in from outside an authenticated route.

#### API Route Handlers, Server Components

Since these are Node.js contexts, they have access to Next.js `cookies`. This means you are able to call the async function `getSession()` from `@lib/session`. This will return the user's session—a copy of the logged in user's auth credentials i.e. name, email, id as a `PrivacyPalAuthUser`—if they are logged in, or `null` if they are not. Node contexts are also able to use Server Actions, which are defined in `@app/actions.ts`. The functions of concern here are `getAuthSession()`, `isLoggedIn()`, `logIn()`, and `logOut()`.

#### Client Components

Client components don't have access to `cookies`, so they must use different techniques for retrieving session status. A GET request to the API route `/api/auth/session` has the same effect as calling `getSession()` (since that's what it actually does). The recommended intermediate effect is to use the custom `useUser()` hook in `@lib/hooks/useUser`. This takes advantage of SWR, a package that will dynamically fetch data and cache it for you. In passive settings, i.e. authentication is not the purpose, this is the recommended method. Because the data is cached, it is not advised to use this hook for authentication.

#### Development Credentials

During development and testing, the following credentials will be used to log in:

```json
{
  "email": "johnny@example.com",
  "password": "password"
}
```

## TESTING

Next.js 13 is compatible with Jest and React Testing Library out of the box. The appropriate packages are already installed. Next.js's documentation can be found here: https://nextjs.org/docs/pages/building-your-application/optimizing/testing#jest-and-react-testing-library.

> **Note:** these docs are only found in the `pages/` router documentation. We are using the `src/app/` router but the docs are still compatible.

### Creating a Test File

Testing React components can be challenging since their "functionality" is highly dependent on their visibility and internal state. React Testing Library gives us the ability to mount a single component virtually and check its state and use it inline just like any other unit test.

From the root of the project you'll see a folder called `__tests__/`. This is where (you guessed it) all tests are stored.

To create a test, create a new file in `__tests__/` ending in `.test.tsx`. For example, a meaningful name to test `<MyComponent/>` from `MyComponent.tsx` would be `MyComponent.test.tsx`. In the provided example tests, `index.test.tsx` tests the `<Home/>` component exported by the page at `/` (the index).

Naming test files can be summarized like this:

- Standalone components `@components/`:
  - `MyComponent.tsx` => `MyComponent.test.tsx`
- Pages `@app/`
  - `sample-page/page.tsx` => `sample-page.test.tsx`

If your test does not rely on types, you can simply name files `.js`. If it relies on types but not React, you can name it `.ts`. If it relies on React, you can name it `.tsx`. Naming with `.tsx` works for every case.

### Writing Tests

[Relevant Next.js documentation.](https://nextjs.org/docs/pages/building-your-application/optimizing/testing#creating-your-tests)

Inside your test file, write something like this:

`__tests__/index.test.tsx`:

```js
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";

/* Example Test: Does the page at `/` render a header? (Should FAIL) */
describe("Home", () => {
  it("page has 'PrivacyPal' semantic heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "PrivacyPal" }),
    ).toBeInTheDocument();
  });

  it("homepage is unchanged from snapshot", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
```

In this example, there is one group of tests called `Home` that:

1. Checks if the `<Home/>` component renders with some heading (`h1`-`h6`) that says "PrivacyPal".
2. Checks if the latest rendered version of the `<Home/>` component matches the snapshot from the first time these tests were run.
   - This is useful if you add some new functionality to a component that should _not_ change its rendered layout.

The tests (`it()`) are of the scope `Home` (`describe()`). The same test file can have multiple `describe` blocks in it, and each of those can contain several tests. Generally, one file should be one page or component. This means, for a given `page.tsx`, since it only exports one component, there should only be one test file and one `describe()` block. If you wrote a component collection, say `Buttons.tsx` which exports `Button` and `DeleteButton`, you should have one test file and two `describe()` blocks.

### Testing an API Route

Take the following API route as an example `src/app/api/example/route.ts`:

```ts
export const add = (a: number, b: number) => a + b;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const a = Number(searchParams.get("a"));
  const b = Number(searchParams.get("b"));

  if (!a || !b) return new Response("Missing a or b", { status: 400 });

  const sum = add(a, b);
  return new Response(`Calculated ${a} + ${b} = ${sum}`, { status: 200 });
}
```

There are a few ways to test this route:

1. Import the `add()` function and test it directly.
2. Test a page or component that fetches data from this route and see if it's contents are correct.

Depending on your routes complexity it would be useful to breakout any dependent functions and test those directly. Most routes, however, only need their output tested so option 2 is the way to go.

### Running Tests

To run tests, run the following command from the root of the project:

```bash
npm run test
```

This will run all tests in the `__tests__/` folder and produce a coverage report. To enable watch mode, run `npm run test -- --watch` instead. Any time you update a file, tests will be rerun.
