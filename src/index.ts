const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createConnection } = require("typeorm");
const { buildSchema } = require("type-graphql");
const { UserResolver } = require("./resolver/resolver");
const runServer = async () => {
  const app = express();

  app.get("/users", (res: any) =>
    res.json([{ name: "Sean" }, { name: "Tariq" }])
  );

  await createConnection();
  //graphical
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(3001, () => {
    console.log("listening to Port ", 3001);
  });
};

runServer();
