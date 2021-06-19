import { createAccessToken, createRefreshToken, tokeSecretKey } from "./auth";
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createConnection } = require("typeorm");
const { buildSchema } = require("type-graphql");
const { UserResolver } = require("./resolver/user.resolver");
const { ProductResolver } = require("./resolver/product.resolver");
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { sendRefreshToken } from "./refresher/sendRefreshToken";
// import cors from "cors";
const runServer = async () => {
  const app = express();

  // app.use(cors({ origin: "http://localhost:3001", credentials: true }));
  app.use(cookieParser());

  app.get("/users", (res: any) =>
    res.json([{ name: "Sean" }, { name: "Tariq" }])
  );

  app.post("/refreshToken", async (res: any, req) => {
    console.log(req.cookies);
    const token = req.cookies.seanToken;

    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload = null; //object firstname

    try {
      payload = verify(token, tokeSecretKey); //{firstName: "sdnfsfjksd"}
    } catch (err) {
      res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ firstName: payload.firstName });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection();
  //graphical
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ProductResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("listening to Port ", 4000);
  });
};

runServer();
