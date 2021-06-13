import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("User")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  firstName: string;

  @Field()
  @Column("text")
  lastName: string;

  @Column("text", { nullable: true })
  password: string;

  @Column("int", { default: 0, nullable: true })
  tokenVersion: number;
}
//bcryptjs : => hash password
// unique : query : matching password :
