import {
  createAccessToken,
  createRefreshToken,
  refershTokeSecretKey,
  // tokeSecretKey,
} from "./../auth";
import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  // UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { Context } from "../context/context";
import { sendRefreshToken } from "../refresher/sendRefreshToken";
import { verify } from "jsonwebtoken";

@ObjectType()
class TokenResponse {
  @Field(() => String)
  accessToken: String;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "HI sean";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => TokenResponse)
  async login(
    @Arg("firstName") firstName: string,
    @Arg("password") password: string,
    @Ctx() { res }: Context
  ) {
    const checkFirstName = await User.findOne({ where: { firstName } });

    if (!checkFirstName) throw new Error("could not find user");

    const comparePassword = await compare(password, checkFirstName.password);

    if (!comparePassword) throw new Error("bad password");

    console.log("res => ", res);
    console.log("checkFirstName => ", checkFirstName);
    const generateRefreshToken = createRefreshToken(checkFirstName);
    sendRefreshToken(res, generateRefreshToken);

    return {
      accessToken: createAccessToken(checkFirstName),
    };
  }

  @Mutation(() => TokenResponse)
  async createUser(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("password") password: string,
    @Ctx() { res }: Context
  ) {
    console.log({ firstName, lastName, password });
    try {
      const hashPassword = await hash(password, 14);
      console.log(hashPassword);
      await User.insert({ firstName, lastName, password: hashPassword });
      //return true;
      const checkFirstName = await User.findOne({ where: { firstName } });
      const generateRefreshToken = createRefreshToken(checkFirstName);
      sendRefreshToken(res, generateRefreshToken);

      return {
        accessToken: createAccessToken({ firstName }),
      };
    } catch (err) {
      return err;
    }
  }

  @Query(() => User)
  async currentUser(@Ctx() { res, req }: Context) {
    console.log("seanToken ===> ", req.cookies.seanToken);
    const getToken = req.cookies.seanToken;
    if (!getToken) throw new Error("You need to login");

    let payload = null; //object firstname

    try {
      console.log(getToken);
      payload = verify(getToken, refershTokeSecretKey);
      console.log(payload);
    } catch (err) {
      res.send({ ok: false, accessToken: "" });
    }
    const user = await User.findOne({ firstName: payload.firstName });
    console.log("user", user);
    if (!user) throw new Error("User not found");

    return user;
  }
}
