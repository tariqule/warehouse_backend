import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";

// @ObjectType()
// class UserResponseType {
//   // @Field(() => Int)
//   // id: number;
//   // @Field(() => String)
//   // firstName: string;
//   // @Field(() => String)
//   // lastName: string;
//   @Field(() => String)
//   status: String;
//   @Field(() => String)
//   code: String;
// }

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "HI sean";
  }

  // @Query(() => [User])
  // users() {
  //   return [
  //     { id: 2, firstName: "Sean", lastName: "john" },
  //     { id: 23, firstName: "Tariq", lastName: "sas" },
  //   ];
  // }

  @Mutation(() => Boolean)
  async createUser(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string
  ) {
    try {
      await User.insert({ firstName, lastName });
      return true;
    } catch (err) {
      return err;
    }
  }
}
