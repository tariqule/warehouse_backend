import { verify } from "jsonwebtoken";
import { refershTokeSecretKey } from "../auth";
import { User } from "../entity/User";
//middleware to check permission each time doing query and mutation
export const isAuth = async ({ context }, next) => {
  console.log(context.req.cookies.seanToken); // exists if user is logged in
  const token = context.req.cookies.seanToken;
  //check if token exists in the cookie throw error if not
  if (!token) throw new Error("you are not authorised");
  //decode token to firstName
  let payload = null; //object firstname
  try {
    payload = verify(token, refershTokeSecretKey); //{firstName: "sdnfsfjksd"}
  } catch (err) {
    throw new Error("get better at hacking");
  }
  //check if firstName exists in the database, throw error if not
  const user = await User.findOne({ firstName: payload.firstName });

  if (!user) {
    throw new Error("get an account");
  }
  if (user.tokenVersion !== payload.tokenVersion) {
    throw new Error("login again");
  }
  context.payload = user;
  //return next();
  return next();
};
