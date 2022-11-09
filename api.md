# API Design 

## Migrations

Since this is our first time interacting with the DB, we need to run our initial migration to get the DB and our schema in sync. \

Before we run a migration, we need to install the prisma client which is the SDK we'll use in our code to interact with the DB. This client is type-safe and based on of our schema. It's actually an NPM package that gets generated on demand to adjust to your schema.

`npm i @prisma/client --save`

To run the migration: `npx prisma migrate dev --name init`

This will migrate the DB over to use our schema and then generate the new client for us. This client will be used in our code and is now type-checked against our schema.

## Route

Now we have our schema and data model, we can start creating routes and route handlers. We want to create a route for every CRUD action for every resource. So, in the case of a `product`, we want to create:

	-	GET product/:id - get a product by a given ID
    -	GET product - get all the products (for an authenticated user)
    -	POST product - create a new product
    -	PUT product/:id - update or replace a product that matches a given ID
    -	DELETE product/:id - delete a product by a give ID

### Creating Routers

Create a new file, `src/router.ts`

```ts
import { Router } from "express";

const router = Router();

/** Product **/
router.get("/product", (req, res) => {
    res.json({ message: "product" });
});
router.get("/product/:id", (req, res) => {}); // :id is parameter here
router.post("/product", (req, res) => {});
router.put("/product/:id", (req, res) => {});
router.delete("/product/:id", (req, res) => {});

/** Update **/

router.get("/update", (req, res) => {});
router.get("/update/:id", (req, res) => {});
router.post("/update", (req, res) => {});
router.put("/update/:id", (req, res) => {});
router.delete("/update/:id", (req, res) => {});

/** UpdatePoint **/

router.get("/updatepoint", (req, res) => {});
router.get("/updatepoint/:id", (req, res) => {});
router.post("/updatepoint", (req, res) => {});
router.put("/updatepoint/:id", (req, res) => {});
router.delete("/updatepoint/:id", (req, res) => {});

export default router;
```

> `app` is our main API. The file that we've created is a sub-API that is a part of the main API.

Notice that those routes are specified for `product`, we don't have routes for `user` yet. As a next step, we have to add this route to our `app`. Go to `src/server.ts` and add:

```ts
import router from './router'

.......
app.use('/api', router)
```

So, in this case, to get all products, we have to send a request to `GET /api/product`.

---

You can use `postman` or `thunder-client(plugin on VSCode)` to test your APIs.

---

## Middlewares

Middleware are functions that run right before your handlers run. They can do things like augment the request, log, handle errors, authenticate, and pretty much anything else. They look exactly like a handler with one difference. Because you can have a list of middleware, there needs to be a mechanism to move into the next middlware function when work is done in the current middleware. It looks like this:

```ts
const myMiddlware = (req, res, next) => {
  // ... do my work, and when I done call next()
  next();
};
```

This next function is exactly what it sounds like. It tells Express that we're done in the middleware and it's safe to proceed to whatever is next (more middleware or a handler).

To apply the middleware to a route, you can do this:

```ts
app.get("/todo/:id", myMiddleware, my2ndMiddleware, handler);
// or
app.get("/todo/:id", [myMiddleware, my2ndMiddleware], handler);
```

An useful middleware for express is morgan. It helps us to log requests. To install:

```
npm i morgan @types/morgan --save-dev 
```

To use morgan, we have to import it on our app.

```ts
import express from "express";
import router from "./router";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use("/api", router);

app.get("/", (req, res) => {
    console.log("we got a get request on /");
    res.status(200);
    res.json({ message: "hello" });
});

export default app;

```

The place we put morgan is important. Since it is a middleware, be sure that you add it before your routes.\

Additionally, you don't have to add morgan to your main app. You can add any middleware to any routes, instead of adding it globally.


Another useful middlewares are:

```ts
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

---

**Nodemon** is a package to provide you hot-reloading. To install it run `npm install nodemon --save-dev`. Once you install update the `dev` script in your `package.json` file:

```
"dev": "nodemon src/index.ts"
```
---

