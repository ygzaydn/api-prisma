https://toolkit.addy.codes/

https://hendrixer.github.io/API-design-v4/

https://www.framer.com/templates/chronos/

# API Design with Nodejs

- [API Design with Nodejs](#api-design-with-nodejs)
  - [Traditional Way](#traditional-way)
  - [API Concepts](#api-concepts)
    - [Server](#server)
    - [Route](#route)
    - [Route Handlers](#route-handlers)
  - [Express](#express)
  - [ORM](#orm)
    - [Prisma](#prisma)
      - [Creating Models](#creating-models)
  - [Migrations](#migrations)
  - [Route](#route-1)
    - [Creating Routers](#creating-routers)
  - [Middlewares](#middlewares)
    - [Defining Custom Middlewares](#defining-custom-middlewares)
  - [Authentication](#authentication)
    - [JWT](#jwt)
    - [Hashing Passwords](#hashing-passwords)
  - [Validators](#validators)
  - [Adding Indexes](#adding-indexes)



Stack that we'll be using:

```
Framework -> Express
Database -> PostgreSQL
Hosting -> Render
```

## Traditional Way

`http` is built-in module on JS that help us to communicate with OS. All frameworks that helps us to create new APIs uses http module (basically adds an abstraction to top of them)

```js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    res.end();
  }
});

server.listen(3001, () => {
  console.log("server on http://localhost:3001");
});
```

```js
import http from "http";

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "hello" }));

    res.end();
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "nope" }));
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
```

When building something trivial like our example, then not using a framework is fine. Maybe even preferred. But you'll have to start creating your abstractions as soon as you build anything. Why create your own when a framework is just that: Abstractions based on some opinions that benefit from having community support.

## API Concepts

### Server

An API is a code that runs on server. A server is an app that has no visual representation and is always running. Usually connected to a network and shared among many clients (UIs, web apps, mobile apps etc.).. Servers usually sit in front of a DB and facilitate access to that DB. 

There are small exceptions here, and that would be serverless APIs. Big difference with serverless APIs is they are not always on like a traditional server. Servers must operate on a port, a virtual place on a computers OS where network connections start and end. Ports help comuters sort out their network traffic.

> On serverless architecture, the request comes in through an API Gateway. The API request is mapped to a dictionary using Velocity Template Language (VTL). A server is created.

### Route

A route is a unique combination of a URL path and a HTTP method. Routers are used to locate certain resources or trigger certain actions on an API. There are many methods, but the common ones are:

    -	GET - used to get information from an API
    -	POST - used to mutate or create new information on an API. Usually has data sent along with the request.
    -	PUT - used to replace existing information on an API. Usually has data sent along with the request.
    -	PATCH - used to update existing information on an API. Usually has data sent along with the request.
    -	DELETE- used to remove existing information on an API.
    -	OPTIONS - used with CORS by browsers to check to see if the client is able to actually communicate

Engineers can design these routes and what the routes actually do however they see fit. To standardize this, there are different approaches to designing these routes. The most popular is REST. There are others like grpc, graphql, and protobuff.

### Route Handlers

A route handler is a function that executes when a certain route is triggered from an incoming request. Depending on the API design and intent of the request, the handler will interact with the DB. Looking at our route examples:

    -	GET /api/user/1 - if this API was a REST API, the route handler would query the database for a user with the ID of 1.
    -	POST /food - if this API was a REST API, the route handler would create a new food in the database, using the data sent along with the request.

A route handler:

```js
if (req.url === "/" && req.method === "GET") {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ message: "hello" }));

  res.end();
  return;
}
```

## Express

Express.js is a really neat and highly adopted framework for Node.js that makes it trivial to build an API. It's by far the most popular one due to it being created near Node.js' time of creation and how much support the community has poured into it. Express is synomous with Django for Python, Sinatra for Ruby, Spring for Java, and Gin for Go Lang

```js
npm i express --save
```

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("hello");
  res.status(200);
  res.json({ message: "Hello" });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
```

## ORM

When it comes to choosing a DB for your API, there are many variables at play.


However, no matter the DB, how you interact with the DB matters. What good is the perfect DB that is painfull to interact with. Enter, and ORM. Object-Relational Mapper (ORM) is a term used to describe a technique that allows you to interact with a DB using an object-oriented approach. When most people say ORM, they're actually talking about an ORM library, which is really just and SDK for your DB. For example, without and ORM, you can only interact with a SQL DB using SQL.

```SQL
INSERT INTO Customers (
  CustomerName,
  ContactName,
  Address,
  City,
  PostalCode,
  Country
)
  VALUES
  ('Cardinal',
  'Tom B. Erichsen',
  'Skagen 21',
  'Stavanger',
  '4006',
  'Norway'
  );
```

Using an ORM, depending on which one, your DB interaction for the same logic might look like this.

```js
db.customers.create({
  customerName: 'Cardinal',
  contactName: 'Tom B. Erichsen',
  address: 'Skagen 21',
  ....
})
```

### Prisma

Prisma is a DB agnostic, type safe ORM. It supports most DBs out there. It not only has an SDK for doing basic and advanced querying of a DB, but also handles schemas, migrations, seeding, and sophisticated writes. It's slowly but surely becoming the ORM of choice for Node.js projects. 

We'll be using PSQL as a DB in this course. You won't have to install anything as we'll be using a hosting and managed DB from Render. We need to create an account first.

To install Prisma:

`npm i typescript ts-node @types/node prisma --save-dev`

Then, create a `tsonconfig.json` file

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
```

Next, we'll initialize Prizma: `npx prisma init` (Make sure you're at root of your project)

This command will do a few things:

    -	Create a prisma folder
    -	Create a schema file in that folder Next, we'll learn how to design and create some models in our schema

> It's highly recommended to use Prisma extension on VSCODE

---

> With the help of TS, we can use ES6 features on .ts files, no need to use .mjs extensions anymore!
> Make sure to install express types by typing `npm install --save-dev @types/express`

---

Prisma has an easy to understand syntax for creating models. Its based on the GraphQL language which is based on JSON.

#### Creating Models

We'll create models on `schema.prisma` file. An example model as follows:

```
model User {
  id String @id @default(uuid())
  createdAt DateTime @default(now())
  username String @unique
  password String
  updates     Update[]
}
```

Let's create Product model that has relation with User.

```
model Product {
	id String @id @default(uuid())
	createdAt DateTime @default(now())
	name String @db.VarChar(255)
	belongsToId String
	belongsTo User @relation(fields:[belongsToId], references:[id])
}
```

The line ` belongsTo User @relation(fields:[belongsToId], references:[id])` defines the connection between models. Whenever you create a connection between models, it's a good practice to run `npx prisma format` to let prisma fix any issue.

Output will look like:

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  username  String    @unique
  password  String
  Product   Product[]
}

model Product {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  name        String   @db.VarChar(255)
  belongsToId String
  belongsTo   User     @relation(fields: [belongsToId], references: [id])
}

```

Products belong to a user now.

Let's create another model `Update` which belongs to `Product`. It'll show the updates on the products. Each product can have multiple updates, but each update belongs to one product.

```
enum UPDATE_STATUS {
  IN_PROGRESS
  LIVE
  DEPRECATED
  ARCHIVED
}

model Update {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime

  title   String        @db.VarChar(255)
  body    String
  status  UPDATE_STATUS @default(IN_PROGRESS)
  version String?
  asset   String

  productId    String
  product      Product       @relation(fields: [productId], references: [id])
}
```

And finally, bullet points for updates:

```
model UpdatePoint {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime

  name        String @db.VarChar(255)
  description String

  updateId String
  update   Update @relation(fields: [updateId], references: [id])
}
```

Overall schema:

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  username  String    @unique
  password  String
  product   Product[]
}

model Product {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  name        String   @db.VarChar(255)
  belongsToId String
  belongsTo   User     @relation(fields: [belongsToId], references: [id])
  update      Update[]
}

enum UPDATE_STATUS {
  IN_PROGRESS
  LIVE
  DEPRECATED
  ARCHIVED
}

model Update {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime

  title   String        @db.VarChar(255)
  body    String
  status  UPDATE_STATUS @default(IN_PROGRESS)
  version String?
  asset   String

  productId   String
  product     Product       @relation(fields: [productId], references: [id])
  updatePoint UpdatePoint[]
}

model UpdatePoint {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime

  name        String @db.VarChar(255)
  description String

  updateId String
  update   Update @relation(fields: [updateId], references: [id])
}

```

## Migrations

Since this is our first time interacting with the DB, we need to run our initial migration to get the DB and our schema in sync. 

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

The place we put morgan is important. Since it is a middleware, be sure that you add it before your routes.

Additionally, you don't have to add morgan to your main app. You can add any middleware to any routes, instead of adding it globally.

Another useful middlewares are:

```ts
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

`urlencoded` parses the text of request and return the generated object of it. (ex. 'google.com?a=1&thing=otherthing')

---

**Nodemon** is a package to provide you hot-reloading. To install it run `npm install nodemon --save-dev`. Once you install update the `dev` script in your `package.json` file:

```
"dev": "nodemon src/index.ts"
```

---

### Defining Custom Middlewares

You can also define custom middlewares to enhance your API. Defining custom middlewares are straightforward.

```ts
app.use((req, res, next) => {
  req.newHeader = "myMiddleware";
  next();
});
```

If you define the middleware above before your routers, you can reach the defined `newHeader` in your requests.

```ts
router.get('/product', (req, res) => {
  res.json({req.newHeader}) //myMiddleware
})
```

In case of TS, you also have to define new type for customized requests.

```ts
import express, { Request } from "express";
import router from "./router";
import morgan from "morgan";

interface MyRequest extends Request {
  secretHeader?: String;
}

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: MyRequest, res, next) => {
  req.secretHeader = "myMiddleware";
  next();
});

app.use("/api", router, morgan("dev"));

app.get("/", (req, res) => {
  console.log("we got a get request on /");
  res.status(200);
  res.json({ message: "hello" });
});

export default app;
```

## Authentication

Tokens are a great approach for this. Things like API Keys and JWT's are good examples of tokens.

### JWT

Users will need to send the JWT on every single request to get access to the API. Our API never stores a JWT, its stored client side.

`npm i jsonwebtoken bcrypt dotenv`

Create a new file `src/modules/auth` and add:

```ts
import jwt from "jsonwebtoken";

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
};
```

This function will take a user and create a JWT from the user's id and username. This is helpful for later when we check for a JWT, we then will know what user is making the request.

---

To use environmental variables in your project, you have to import `dotenv` to your entry file. It's index.ts in our case. Add this to start of your file.

```ts
import * as dotenv from "dotenv";

dotenv.config();
```

---

As a next step, we have to create a custom middleware to check JWT. Create a new file `/src/middlewares/protect.ts` and add:

```ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IRequest extends Request {
  user?: JwtPayload | string;
}

export const protect = (req: IRequest, res: Response, next: NextFunction) => {
  const bearer = req.header("authorization");

  if (!bearer) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  const [, token] = bearer.split("");
  if (!token) {
    console.log("here");
    res.status(401);
    res.send("Not authorized");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload;
    console.log(payload);
    next();
    return;
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send("Not valid token");
    return;
  }
};
```

> If we didn't wrap our payload check on `try-cache`, server would down in case of error. In this case, server will keep running.

Lastly, we need to add our middleware onto our API router to protect it, so inside of `src/server.ts`, import protect and add it to the chain:

`app.use("/api", protect, router)`

Now any API call to anthing `/api` will need to have a JWT. Also, in order to have successful response, we have to **verify** our JWT, otherwise server will call _JsonWebTokenError: jwt malformed_ error.

> Best place to keep JWT is cookie.

### Hashing Passwords

We know from our schema that a user needs a unique username and password. Instead of keeping passwords plain-text format, it's wiser choice to encrypt that.

Inside of `src/modules/auth.ts`:

```ts
import * as bcrypt from "bcrypt";

// Following functions returns a Promise
export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};
```

Now, its time to communicate with our DB. In order to do this operation, we need a client. To create a client, let's create a new file `src/db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

Anytime we need a client, we can import now. Let's code a handler for new user now.

Create `src/handlers/user.ts`:

```ts
import prisma from "../db";
import { createJWT, hashPassword } from "../modules/auth";
import { Request, Response } from "express";

export const createNewUser = async (req: Request, res: Response) => {
  const hash = await hashPassword(req.body.password);

  // Prisma client is aware all of the models that we've created. So we can use .user method.
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hash,
    },
  });

  const token = createJWT(user);
  res.json({ token });
};
```

Let's add one more function for sign in:

```ts
export const signIn = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (user) {
    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "nope" });
      return;
    }

    const token = createJWT(user);
    res.json({ token });
    return;
  }
  res.status(401);
  res.json({ message: "nope" });
  return;
};
```

Now, we need to create some routes and add those handlers. On `src/server.ts`:

```ts
import { createNewUser, signin } from "./handlers/user";

app.post("/user", createNewUser);
app.post("/signin", signin);
```

Let's send a POST request to "/user" with body of

```json
{
  "username": "scott",
  "password": "password"
}
```

As a result, we'll have a token response.

> You can check your records by typing **npx prisma studio** over a new terminal. It'll open a webpage that shows you your DB records.

And when you run `api/product` with given token, you'll get 200 OK message, means that we're good to go now.

## Validators

We should have some validators for incoming request before processing it. Users might have send unwanted form of requests. That is the place of input validators. They prevent crashing of our server.

Express has a middleware that behaves as a validator.

`npm i express-validator --save`

You can use it as follows:

```ts
import { body, validationResult } from 'express-validator';

app.post("/", body("name").exists(), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    res.json({errors: errors.array()})
  }
})

```

The validator above will check if incoming request has property named `name` inside its body.

## Adding Indexes

You can add index to your db by using `@@` notation. For example on product model we can add:

```
@@unique([id,belongsToId])
```

Later, we need to migrate the change by typing `npx prisma migrate`. To use the generated index:

```js
where:{
  id_belongsToId: {
    id: req.params.id, 
    belongsToId:id
  }
}
```