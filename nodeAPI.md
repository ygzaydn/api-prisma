https://toolkit.addy.codes/
https://hendrixer.github.io/API-design-v4/
https://www.framer.com/templates/chronos/

# API Design with Nodejs

Stack that we'll be using:

```
Framework -> Express
Database -> PostgreSQL
Hosting -> Render
```

## Traditional Way

`http` is built-in module on JS that help us to communicate with OS. All frameworks that helps us to crete new APIs uses http module (basically adds an abstraction to top of them)

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

An API is a code that runs on server. A server is an app that has no visual representation and is always running. Usually connected to a network and shared among many clients (UIs, web apps, mobile apps etc.).. Servers usually sit in front of a DB and facilitate access to that DB. \

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
const express = require('express')

const app = express()

app.get('/',(req,res) => {
	console.log('hello')
	res.status(200)
	res.json({message:'Hello'})
})

app.listen(3001, () => {
	console.log('Server is running on http://localhost:3001')
})
```

## ORM

When it comes to choosing a DB for your API, there are many variables at play.\
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

Prisma is a DB agnostic, type safe ORM. It supports most DBs out there. It not only has an SDK for doing basic and advanced querying of a DB, but also handles schemas, migrations, seeding, and sophisticated writes. It's slowly but surely becoming the ORM of choice for Node.js projects. \

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

The line `	belongsTo User @relation(fields:[belongsToId], references:[id])` defines the connection between models. Whenever you create a connection between models, it's a good practice to run `npx prisma format` to let prisma fix any issue.

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