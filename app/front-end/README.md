# Front End

Created with Next.js 13 featuring TypeScript, Tailwind CSS, and the `./src/` folder structure.

## Requirements

-   Node.js 18+
-   npm 9.8.1+

## Running the App

First, navigate to this folder in your terminal (`year-long-project-team-1/app/front-end/`) and run `npm install`.

### Development

This starts a development server at `http://localhost:3000`.

```bash
npm run dev
```

### Local Build

This builds the Next.js app and runs it locally at `http://localhost:8080`. Pages are compiled and elements are served statically where applicable.

This is **not** the same as a Docker build, though our Dockerfile does use this command.

```bash
npm run build
npm run start
```

## File Structure

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
    return <MyButton className="btn-delete btn-red" label="Delete" onClick={onClick} />;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ message: "Hello World!" });
}
```

### Static and Public Files

The only files that users can typically access from the web are the routes within `./src/app/` and `./src/app/api`. Files within this routes are not accessible to users.

To serve images, fonts, or downloadable files we must place them in the `./public` folder. These _are_ accessible to users from the web.

To have common scripts across pages and components, we must place them in the `./src/lib` folder. This is for custom scripts that are not React components or API routes. For example, string manipulation, date formatting, etc. This makes a good place for things like database abstraction code, such as a class and its subclasses that are used to query a database. These _are not_ accessible to users from the web.
