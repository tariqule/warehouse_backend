import { createAccessToken } from "./../auth";
import { compare, hash } from "bcryptjs";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User";

@ObjectType()
class LoginResponse {
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("firstName") firstName: string,
    @Arg("password") password: string
  ) {
    const checkFirstName = await User.findOne({ where: { firstName } });

    if (!checkFirstName) throw new Error("could not find user");

    const comparePassword = await compare(password, checkFirstName.password);

    if (!comparePassword) throw new Error("bad password");

    return {
      accessToken: createAccessToken(checkFirstName),
    };
  }

  @Mutation(() => Boolean)
  async createUser(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("password") password: string
  ) {
    console.log({ firstName, lastName, password });
    try {
      const hashPassword = await hash(password, 14);
      console.log(hashPassword);
      await User.insert({ firstName, lastName, password: hashPassword });
      return true;
    } catch (err) {
      return err;
    }
  }
}
// $2a$14$4tcfSVeGA7zF3OQRrZ7BuOHHtJFpDXy6hF9q648hezv4IHd9yLp3y
// $2a$14$6jK84wOqgfLalAbDbMv8ie5OGnL4Jhw8s0fSf4oGl9nMZ9KzcWLXa
// $2a$14$/ZhIRl61KbjglngoPkWPJuJeBXlplmv9AGwyO8WW/Z/bCq0sPbsU2
// $2a$14$tYuqjYqLD8o38PdQbybQMOApXhJfcmz4E7aHlxOe8j2FB.3dqne.G
